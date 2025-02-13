'use server';

const getVoiceDepress = async (audioFile: File) => {
  try {
    const result = await fetch(
      `${process.env.AI_MODEL_API_URL}/voice-depress`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: audioFile,
      },
    );

    return result.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getVoiceDepress;
