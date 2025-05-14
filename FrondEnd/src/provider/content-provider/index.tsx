"use client";
import { getAxiosInstace } from "@/utils/axioaInstance";
import { useContext, useReducer } from "react";
import { ConentReducer } from "./reducer";
import {
  ContentActionContext,
  ContentStateContext,
  IContent,
  INITIAL_STATE,
} from "./context";
import {
  createContentError,
  createContentPending,
  createContentSuccess,
  deleteContentError,
  deleteContentPending,
  deleteContentSuccess,
  downloadContentFileError,
  downloadContentFilePending,
  downloadContentFileSuccess,
  getAllContentsError,
  getAllContentsPending,
  getAllContentsSuccess,
  getContentFileError,
  getContentFilePending,
  getContentFileSuccess,
  updateContentError,
  updateContentPending,
  updateContentSuccess,
  uploadContentFileError,
  uploadContentFilePending,
  uploadContentFileSuccess,
} from "./action";

export const ContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ConentReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  const createContent = async (content: IContent) => {
    dispatch(createContentPending());
    const endpoint = "endpoitn url";
    return instance
      .post(endpoint, content)
      .then((response) => dispatch(createContentSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(createContentError());
      });
  };

  const getAllContents = async () => {
    dispatch(getAllContentsPending());
    const endpoint = "endpoitn url";
    return instance
      .get(endpoint)
      .then((response) => dispatch(getAllContentsSuccess(response.data)))
      .catch((error) => {
        console.error("Error get an Content:", error);
        dispatch(getAllContentsError());
      });
  };

  const updateContent = async (content: IContent) => {
    dispatch(updateContentPending());
    const endpoint = "endpoitn url";
    return instance
      .put(endpoint, content)
      .then((response) => dispatch(updateContentSuccess(response.data)))
      .catch((error) => {
        console.error("Error updating Content:", error);
        dispatch(updateContentError());
      });
  };

  const deleteContent = async (id: string) => {
    dispatch(deleteContentPending());
    const endpoint = `endpoitn url/${id}`;
    return instance
      .delete(endpoint)
      .then((response) => dispatch(deleteContentSuccess(response.data)))
      .catch((error) => {
        console.error("Error deleting Content:", error);
        dispatch(deleteContentError());
      });
  };

  const uploadContentFile = async (pdfUrl: string) => {
    dispatch(uploadContentFilePending());
    const endpoint = "endpoint url"; // correct this URL
    try {
      const response = await instance.post(endpoint, { pdfUrl });
      dispatch(uploadContentFileSuccess(response.data));
    } catch (error) {
      console.error("Error uploading Content file:", error);
      dispatch(uploadContentFileError());
    }
  };

  const getcontentFile = async (id: string) => {
    dispatch(getContentFilePending());
    const endpoint = `endpoitn url/${id}`;
    return instance
      .get(endpoint)
      .then((response) => dispatch(getContentFileSuccess(response.data)))
      .catch((error) => {
        console.error("Error getting Content file:", error);
        dispatch(getContentFileError());
      });
  };

  const downloadContentFile = async (pdfUrl: string) => {
    dispatch(downloadContentFilePending());
    const endpoint = `endpoitn url/${pdfUrl}`;
    return instance
      .get(endpoint, { responseType: "blob" })
      .then((response) => {
        dispatch(downloadContentFileSuccess(response.data));
        // Create a link element to download the fil
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", pdfUrl);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading Content file:", error);
        dispatch(downloadContentFileError());
      });
  };

  return (
    <ContentStateContext.Provider value={state}>
      <ContentActionContext.Provider
        value={{
          createContent,
          getAllContents,
          updateContent,
          deleteContent,
          uploadContentFile,
          getcontentFile,
          downloadContentFile,
        }}
      >
        {children}
      </ContentActionContext.Provider>
    </ContentStateContext.Provider>
  );
};

export const useContentState = () => {
  const context = useContext(ContentStateContext);
  if (!context) {
    throw new Error("useContentState must be used within a ContentProvider");
  }
  return context;
};

export const useContentAction = () => {
  const context = useContext(ContentActionContext);
  if (!context) {
    throw new Error(
      "useContentAction must be used within a ContentActionProvider"
    );
  }
  return context;
};
