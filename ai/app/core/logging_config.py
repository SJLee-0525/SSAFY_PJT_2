import logging
import os
import atexit
from app.core.config import settings
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from typing import Callable

# logs 디렉토리 자동 생성
LOG_DIR = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), "..", "logs")
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)


def get_log_file_path():
    # 날짜별 로그 파일 경로 설정 함수 (파일 이름을 최신 날짜로 유지)
    today_date = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(LOG_DIR, f"app_{today_date}.log")


def get_error_log_file_path():
    today_date = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(LOG_DIR, f"error_{today_date}.log")


class CustomTimedRotatingFileHandler(TimedRotatingFileHandler):
    # CustomTimedRotatingFileHandler (자동 회전 시 날짜 업데이트)
    def __init__(self, filename: Callable[[], str], when: str, interval: int, backupCount: int, encoding: str):
        """
        동적으로 파일명을 설정할 함수 저장
        * 회전이란 새로운 로그 파일에 데이터를 저장할 수 있도록 전환하는 행위를 뜻함

        Args:
            filename(function): 파일 이름을 업데이트 하는 함수
            when(str): 회전 주기 단위(시, 분, 초 등등)
            interval(int): 회전 주기
            backupCount(int): 최대 백업 파일 갯수
            encoding(str): 로그 데이터 저장 인코딩 방식
        """
        self.baseFilenameFunc: Callable[[], str] = filename
        super().__init__(filename(), when=when, interval=interval,
                         backupCount=backupCount, encoding=encoding)

    def doRollover(self):
        """
        날짜가 변경되었을 때 새로운 파일 이름을 설정하여 자동 회전.
        """
        # 새로운 날짜의 파일 경로로 업데이트
        self.baseFilename = self.baseFilenameFunc()
        # 기본 회전 실행
        super().doRollover()

    def shouldRollover(self, record):
        """
        날짜가 변경되었는지 확인하여 회전 여부 결정.
        """
        current_date = datetime.now().strftime("%Y-%m-%d")

        # 파일 이름은 ~_{date}.log 형태임.
        log_file_date = os.path.basename(
            self.baseFilename).split("_")[-1].split(".")[0]
        # 날짜가 다르면 회전 필요
        return current_date != log_file_date


# 일반 로그 핸들러 (날짜 변경 시 자동 회전)
file_handler = CustomTimedRotatingFileHandler(
    get_log_file_path,
    when=settings.LOG_INTERVAL_UNIT,
    interval=settings.LOG_INTERVAL,
    backupCount=settings.LOG_FILE_BACKUP_COUNT,
    encoding=settings.LOG_ENCODING_METHOD,
)

file_handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(message)s"))

# ERROR 로그 핸들러 (날짜 변경 시 자동 회전)
error_handler = CustomTimedRotatingFileHandler(
    get_error_log_file_path,
    when=settings.LOG_INTERVAL_UNIT,
    interval=settings.LOG_INTERVAL,
    backupCount=settings.LOG_FILE_BACKUP_COUNT,
    encoding=settings.LOG_ENCODING_METHOD,
)
error_handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(message)s"))
error_handler.setLevel(logging.ERROR)

# 콘솔 핸들러 (터미널 출력용)
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(message)s"))

# 로거 설정
logger = logging.getLogger("AppLogger")
logger.setLevel(logging.DEBUG)  # DEBUG부터 모든 로그 출력
logger.addHandler(file_handler)
logger.addHandler(error_handler)
logger.addHandler(console_handler)

# 프로그램 실행 시 강제 롤오버 수행 (날짜 변경 확인)
if file_handler.shouldRollover(None):
    file_handler.doRollover()
if error_handler.shouldRollover(None):
    error_handler.doRollover()

# 프로그램 종료 시 로그 핸들러 닫기 (자원 정리)


def close_log_handlers():
    for handler in logger.handlers:
        handler.close()
        logger.removeHandler(handler)


# 프로그램 종료 시 자동 실행
atexit.register(close_log_handlers)
