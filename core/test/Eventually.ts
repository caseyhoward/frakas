// As of now, this is only needed to deal with dynamodb eventual consistency

export async function eventually<T = void>(
  block: () => Promise<T>,
  timeoutSeconds: number = 3,
  startTime: number = new Date().getTime()
): Promise<T> {
  try {
    return await block();
  } catch (error) {
    // console.log(error);
    const elapsedTime = new Date().getTime() - startTime;
    if (elapsedTime < timeoutSeconds * 1000) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return eventually(block, timeoutSeconds, startTime);
    } else {
      throw error;
    }
  }
}
