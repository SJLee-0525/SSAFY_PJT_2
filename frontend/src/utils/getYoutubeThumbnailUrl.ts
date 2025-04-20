export function getYoutubeThumbnailUrl(youtubeUrl: string) {
  let videoId = "";

  // 1. 표준 링크 처리
  if (youtubeUrl.includes("youtube.com/watch?v=")) {
    videoId = youtubeUrl.replace("https://www.youtube.com/watch?v=", "").split("&")[0];
    // split('&')[0]: 매개변수가 있는 경우 잘라내기 위함
  }
  // 2. 짧은 링크 처리
  else if (youtubeUrl.includes("youtu.be/")) {
    videoId = youtubeUrl.replace("https://youtu.be/", "").split("?")[0];
  }
  // 3. 임베드 링크 처리
  else if (youtubeUrl.includes("youtube.com/embed/")) {
    videoId = youtubeUrl.replace("https://www.youtube.com/embed/", "").split("?")[0];
  }

  // 4. 썸네일 URL 반환(videoId 없으면 빈 문자열 반환)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
}
