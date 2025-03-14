import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
}

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface GitHubState {
  repositories: Repository[];
  selectedRepo: {
    data: Repository | null;
    status: RequestStatus;
    error: string | null;
  }
  status: RequestStatus;
  error: string | null;
}

const initialState: GitHubState = {
  repositories: [],
  selectedRepo: {
    data: null,
    status: 'idle',
    error: null,
  },
  status: "idle",
  error: null,
};

export const fetchRepositories = createAsyncThunk(
  "github/fetchRepositories",
  async ({ login, token }: { login: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${login}/repos`, {
        headers: { Authorization: `token ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при загрузке репозиториев");
    }
  }
);

export const updateRepository = createAsyncThunk(
  "repo/updateRepository",
  async ({ login, token, repoName, data }: { login: string; token: string; repoName: string; data: Partial<Repository> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`https://api.github.com/repos/${login}/${repoName}`, data, {
        headers: { Authorization: `token ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при обновлении репозитория");
    }
  }
);

export const deleteRepository = createAsyncThunk(
  "repo/deleteRepository",
  async ({ login, token, repoName }: { login: string; token: string; repoName: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`https://api.github.com/repos/${login}/${repoName}`, {
        headers: { Authorization: `token ${token}` },
      });
      return repoName;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при удалении репозитория");
    }
  }
);

export const fetchRepositoryDetails = createAsyncThunk(
  "repo/fetchRepositoryDetails",
  async ({ login, token, repoName }: { login: string; token: string; repoName: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${login}/${repoName}`, {
        headers: { Authorization: `token ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при получении данных репозитория");
    }
  }
);

export const createRepository = createAsyncThunk(
  "repo/createRepository",
  async ({ login, token, name, description, visibility }: { login: string; token: string; name: string; description?: string; visibility: "public" | "private" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.github.com/user/repos`,
        {
          name,
          description,
          private: visibility === "private",
        },
        {
          headers: { Authorization: `token ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при создании репозитория");
    }
  }
);

const githubSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение репозиториев
      .addCase(fetchRepositories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRepositories.fulfilled, (state, action: PayloadAction<Repository[]>) => {
        state.status = "succeeded";
        state.repositories = action.payload;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Обновление репозитория
      .addCase(updateRepository.fulfilled, (state, action: PayloadAction<Repository>) => {
        state.repositories = state.repositories.map((repo) =>
          repo.id === action.payload.id ? action.payload : repo
        );
      })
      // Удаление репозитория
      .addCase(deleteRepository.fulfilled, (state, action: PayloadAction<string>) => {
        state.repositories = state.repositories.filter((repo) => repo.name !== action.payload);
      })
      // Получение информации о репозитории
      .addCase(fetchRepositoryDetails.fulfilled, (state, action: PayloadAction<Repository>) => {
        state.selectedRepo.status = "succeeded";
        state.selectedRepo.data = action.payload;
      })
      .addCase(fetchRepositoryDetails.pending, (state) => {
        state.selectedRepo.status = "loading";
      })
      .addCase(fetchRepositoryDetails.rejected, (state) => {
        state.selectedRepo.error = "failed";
      })
      .addCase(createRepository.fulfilled, (state, action: PayloadAction<Repository>) => {
        state.repositories = [action.payload, ...state.repositories]
      });
  },
});

export default githubSlice.reducer;
