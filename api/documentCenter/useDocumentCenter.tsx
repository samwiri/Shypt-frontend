import client from "..";
import {
  Document,
  PaginatedDocumentsResponse,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  MessageResponse,
} from "../types/documentCenter";

const useDocumentCenter = () => {
  const listDocuments = async (): Promise<PaginatedDocumentsResponse> => {
    const { data } = await client.get("/api/documents");
    return data;
  };

  const createDocument = async (
    payload: CreateDocumentPayload,
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("file_url", payload.file);

    const { data } = await client.post("/api/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const showDocument = async (id: number): Promise<Document> => {
    const { data } = await client.get(`/api/documents/${id}`);
    return data.data;
  };

  const updateDocument = async (
    id: number,
    payload: UpdateDocumentPayload,
  ): Promise<Document> => {
    const formData = new FormData();
    if (payload.name) {
      formData.append("name", payload.name);
    }
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.file) {
      formData.append("file_url", payload.file);
    }

    // For PUT with FormData, some backends expect a `_method` field.
    formData.append("_method", "PUT");

    const { data } = await client.post(`/api/documents/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const deleteDocument = async (id: number): Promise<MessageResponse> => {
    const { data } = await client.delete(`/api/documents/${id}`);
    return data;
  };

  return {
    listDocuments,
    createDocument,
    showDocument,
    updateDocument,
    deleteDocument,
  };
};

export default useDocumentCenter;