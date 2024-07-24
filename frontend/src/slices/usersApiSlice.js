import { apiSlice } from "./apiSlices";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    updaterofileUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    fetchUsers: builder.query({
      query: () => `${USERS_URL}/userlist`,
      transformResponse: (response) => response.users,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: `${USERS_URL}/userlist`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/userlist/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/userlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateProfileUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useFetchUsersQuery,
  useUpdateUserMutation,
} = userApiSlice;
