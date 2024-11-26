import { SelectItem } from "@/config";
import axios from "axios";

export interface CourseSelectResponse {
  success: boolean;
  courses: SelectItem[];
}

export async function CourseSelect(): Promise<CourseSelectResponse> {
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/course/select`;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get<CourseSelectResponse>(api_url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      courses: [],
    };
  }
}