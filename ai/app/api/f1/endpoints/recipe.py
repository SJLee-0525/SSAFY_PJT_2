# app/api/f1/endpoints/recipe.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.recipe_summary import RecipeSummary
from app.models.youtube_url import YoutubeURL
from app.utils.docs import RecipeDocs
from app.core.config import settings

router = APIRouter()
recipe_summary = RecipeSummary()
docs = RecipeDocs()


@router.post(
    "/",
    summary="텍스트 레시피 추출",
    description="URL로 부터 자막을 가져와 텍스트로 된 레시피를 추출합니다.",
    response_description="레시피 추출 결과",
    responses=docs.base["res"],
)
async def get_recipe_summary(request: Request, data: YoutubeURL = docs.base["data"]):
    try:
        if settings.ENV != "LOCAL":
            security_key = request.headers.get("x-api-key")
            if security_key != settings.FASTAPI_SECURITY_KEY:
                raise HTTPException(
                    status_code=401, detail="Invalid FASTAPI SECURITY KEY")

        video_id = data.youtube_url.split("v=")[1].split("&")[0]
        summary = await recipe_summary.summarize_recipe(video_id)
        # TODO: 만일 레시피 요약 정보가 아닌 경우 처리해주기
        if summary == settings.SUMMARY_NOT_COOKCING_VIDEO_CODE:
            raise HTTPException(
                status_code=settings.SUMMARY_NOT_COOKCING_VIDEO_CODE,
                detail=f"해당 영상은 요리 영상이 아니므로 레시피를 추출할 수 없습니다.")
        elif summary == settings.SUMMARY_NOT_VALID_TRANSCRIPT_CODE:
            raise HTTPException(
                status_code=settings.SUMMARY_NOT_VALID_TRANSCRIPT_CODE,
                detail=f"해당 영상에서 충분한 자막을 제공하지 않으므로 레시피를 추출할 수 없습니다.")

        # 가령, 영상이 노래 영상이였다거나 등등
        return JSONResponse(status_code=200, content=summary)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
