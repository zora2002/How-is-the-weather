import axios, { AxiosInstance } from "axios";

export const axiosInstances: Record<
  string,
  {
    controller: AbortController;
    instance: AxiosInstance;
  }
> = {};

export const cancelPreviousPageRequests = (previousPath: string) => {
  axiosInstances[previousPath]?.controller.abort();
};

export const creatInstance = () => {
  const controller = new AbortController();
  const customAxiosInstance = {
    controller,
    instance: axios.create({
      signal: controller.signal
    })
  };
  return customAxiosInstance;
};

export const getInstance = (pathName: string): AxiosInstance => {
  if (
    axiosInstances[pathName] &&
    !axiosInstances[pathName].controller.signal.aborted
  ) {
    return axiosInstances[pathName].instance;
  } else {
    const customAxiosInstance = creatInstance();
    axiosInstances[pathName] = customAxiosInstance;
    return axiosInstances[pathName].instance;
  }
};
