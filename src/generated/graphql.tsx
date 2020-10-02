import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  posts: PaginatedPosts;
  thread?: Maybe<Array<Post>>;
  post?: Maybe<Post>;
  me?: Maybe<User>;
  users: Array<User>;
  user?: Maybe<User>;
  hello: Scalars['String'];
  token: PayloadResponse;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryThreadArgs = {
  maxLevel?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  points: Scalars['Int'];
  author: User;
  opId?: Maybe<Scalars['Int']>;
  parentId?: Maybe<Scalars['Int']>;
  level: Scalars['Int'];
  replies: Scalars['Int'];
  voteStatus?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  posts: Array<Post>;
  upvotes: Array<Upvote>;
  verified: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isBanned: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
};

export type Upvote = {
  __typename?: 'Upvote';
  user: User;
  post: Post;
};


export type PayloadResponse = {
  __typename?: 'PayloadResponse';
  jwt?: Maybe<Payload>;
};

export type Payload = {
  __typename?: 'Payload';
  userId: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  postReply: PostReplyResponse;
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  sendVerifyEmail: Scalars['Boolean'];
  verifyEmail: VerifyResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
};


export type MutationVoteArgs = {
  vote: Vote;
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationUpdatePostArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  opId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};


export type MutationPostReplyArgs = {
  input: PostReplyInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UserRegisterInput;
};


export type MutationSendVerifyEmailArgs = {
  email: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationLoginArgs = {
  options: UserLoginInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

/** UP or DOWN vote a post */
export enum Vote {
  Up = 'UP',
  Down = 'DOWN'
}

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type PostReplyResponse = {
  __typename?: 'PostReplyResponse';
  post?: Maybe<Post>;
  error?: Maybe<Scalars['String']>;
};

export type PostReplyInput = {
  parentId: Scalars['Int'];
  text: Scalars['String'];
  opId: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  accessToken?: Maybe<Scalars['String']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type VerifyResponse = {
  __typename?: 'VerifyResponse';
  errors?: Maybe<Array<FieldError>>;
  verified?: Maybe<Scalars['Boolean']>;
};

export type UserLoginInput = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};

export type BasicPostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'points' | 'replies' | 'opId' | 'parentId' | 'level' | 'voteStatus' | 'createdAt' | 'updatedAt'>
  & { author: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type PostContentFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'text'>
  & BasicPostFragment
);

export type PostSummaryFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'textSnippet'>
  & BasicPostFragment
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'message' | 'field'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'verified' | 'isAdmin' | 'isBanned'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & Pick<UserResponse, 'accessToken'>
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
  userId: Scalars['ID'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'text'>
    & BasicPostFragment
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
  opId?: Maybe<Scalars['Int']>;
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: UserLoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type PostReplyMutationVariables = Exact<{
  input: PostReplyInput;
}>;


export type PostReplyMutation = (
  { __typename?: 'Mutation' }
  & { postReply: (
    { __typename?: 'PostReplyResponse' }
    & Pick<PostReplyResponse, 'error'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'text'>
      & BasicPostFragment
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  options: UserRegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type SendVerifyEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendVerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendVerifyEmail'>
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'text'>
    & BasicPostFragment
  )> }
);

export type VerifyEmailMutationVariables = Exact<{
  userId: Scalars['ID'];
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & { verifyEmail: (
    { __typename?: 'VerifyResponse' }
    & Pick<VerifyResponse, 'verified'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type VoteMutationVariables = Exact<{
  vote: Vote;
  postId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostContentFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSummaryFragment
    )> }
  ) }
);

export type ThreadQueryVariables = Exact<{
  id: Scalars['ID'];
  maxLevel?: Maybe<Scalars['Int']>;
}>;


export type ThreadQuery = (
  { __typename?: 'Query' }
  & { thread?: Maybe<Array<(
    { __typename?: 'Post' }
    & PostContentFragment
  )>> }
);

export type TestTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type TestTokenQuery = (
  { __typename?: 'Query' }
  & { token: (
    { __typename?: 'PayloadResponse' }
    & { jwt?: Maybe<(
      { __typename?: 'Payload' }
      & Pick<Payload, 'userId' | 'isAdmin'>
    )> }
  ) }
);

export const BasicPostFragmentDoc = gql`
    fragment BasicPost on Post {
  id
  title
  points
  replies
  author {
    id
    username
  }
  opId
  parentId
  level
  voteStatus
  createdAt
  updatedAt
}
    `;
export const PostContentFragmentDoc = gql`
    fragment PostContent on Post {
  ...BasicPost
  text
}
    ${BasicPostFragmentDoc}`;
export const PostSummaryFragmentDoc = gql`
    fragment PostSummary on Post {
  ...BasicPost
  textSnippet
}
    ${BasicPostFragmentDoc}`;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  message
  field
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  verified
  isAdmin
  isBanned
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
  accessToken
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $token: String!, $userId: ID!) {
  changePassword(newPassword: $newPassword, token: $token, userId: $userId) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    ...BasicPost
    text
  }
}
    ${BasicPostFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!, $opId: Int) {
  deletePost(id: $id, opId: $opId)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($options: UserLoginInput!) {
  login(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const PostReplyDocument = gql`
    mutation PostReply($input: PostReplyInput!) {
  postReply(input: $input) {
    error
    post {
      ...BasicPost
      text
    }
  }
}
    ${BasicPostFragmentDoc}`;

export function usePostReplyMutation() {
  return Urql.useMutation<PostReplyMutation, PostReplyMutationVariables>(PostReplyDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UserRegisterInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SendVerifyEmailDocument = gql`
    mutation SendVerifyEmail($email: String!) {
  sendVerifyEmail(email: $email)
}
    `;

export function useSendVerifyEmailMutation() {
  return Urql.useMutation<SendVerifyEmailMutation, SendVerifyEmailMutationVariables>(SendVerifyEmailDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(id: $id, title: $title, text: $text) {
    ...BasicPost
    text
  }
}
    ${BasicPostFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($userId: ID!, $token: String!) {
  verifyEmail(userId: $userId, token: $token) {
    errors {
      field
      message
    }
    verified
  }
}
    `;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const VoteDocument = gql`
    mutation Vote($vote: Vote!, $postId: Int!) {
  vote(vote: $vote, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...PostContent
  }
}
    ${PostContentFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSummary
    }
  }
}
    ${PostSummaryFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ThreadDocument = gql`
    query Thread($id: ID!, $maxLevel: Int) {
  thread(id: $id, maxLevel: $maxLevel) {
    ...PostContent
  }
}
    ${PostContentFragmentDoc}`;

export function useThreadQuery(options: Omit<Urql.UseQueryArgs<ThreadQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ThreadQuery>({ query: ThreadDocument, ...options });
};
export const TestTokenDocument = gql`
    query TestToken {
  token {
    jwt {
      userId
      isAdmin
    }
  }
}
    `;

export function useTestTokenQuery(options: Omit<Urql.UseQueryArgs<TestTokenQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TestTokenQuery>({ query: TestTokenDocument, ...options });
};