'use server';

const getSpeechToText = async (audioFile: File) => {
  try {
    const result = await fetch(`${process.env.NAVER_CLOVA_API_URL}?lang=Kor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-CLOVASPEECH-API-KEY': process.env.NAVER_CLOVA_SECRET_KEY!,
      },
      body: audioFile,
    });
    return result.json();
  } catch (error) {
    console.error(error);
    return JSON.stringify(error);
  }
};

export default getSpeechToText;
