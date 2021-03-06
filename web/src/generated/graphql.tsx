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
  token: PayloadResponse;
  posts: PaginatedPosts;
  thread?: Maybe<Array<Post>>;
  post?: Maybe<Post>;
  userProfile?: Maybe<User>;
  me?: Maybe<User>;
  users: Array<User>;
};


export type QueryPostsArgs = {
  options: PostsInput;
};


export type QueryThreadArgs = {
  maxLevel?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUserProfileArgs = {
  userId: Scalars['ID'];
};

export type PayloadResponse = {
  __typename?: 'PayloadResponse';
  jwt?: Maybe<Payload>;
};

export type Payload = {
  __typename?: 'Payload';
  userId: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
  bannedUntil: Scalars['DateTime'];
  tokenVersion: Scalars['Float'];
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
  author: User;
  originalPost?: Maybe<Post>;
  parent?: Maybe<Post>;
  level: Scalars['Int'];
  replies: Scalars['Int'];
  score: Scalars['Int'];
  voteCount: Scalars['Int'];
  voteStatus?: Maybe<Scalars['Int']>;
  reply?: Maybe<Post>;
  isLocked: Scalars['Boolean'];
  flaggedAt?: Maybe<Scalars['DateTime']>;
  isPinned: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  verified: Scalars['Boolean'];
  score: Scalars['Int'];
  lastPostAt?: Maybe<Scalars['DateTime']>;
  lastActiveAt?: Maybe<Scalars['DateTime']>;
  isAdmin: Scalars['Boolean'];
  bannedUntil?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
};

export type PostsInput = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Cursor>;
  sortOptions: SortOptions;
};

export type Cursor = {
  value?: Maybe<Scalars['Int']>;
  timeStamp?: Maybe<Scalars['String']>;
};

export type SortOptions = {
  sortBy: SortBy;
  sortDirection?: Maybe<Sort>;
};

/** Sort posts */
export enum SortBy {
  Age = 'AGE',
  Score = 'SCORE',
  Votes = 'VOTES',
  Replies = 'REPLIES'
}

/** Sort posts ASC or DESC */
export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  createPost: PostResponse;
  updatePost: PostResponse;
  deletePost: DeletePostResponse;
  flagPost?: Maybe<Post>;
  toggleLockThread?: Maybe<Array<Post>>;
  togglePinThread?: Maybe<Post>;
  postReply: PostReplyResponse;
  toggleBanUser: User;
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
  input: UpdatePostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationFlagPostArgs = {
  id: Scalars['Int'];
};


export type MutationToggleLockThreadArgs = {
  id: Scalars['Int'];
};


export type MutationTogglePinThreadArgs = {
  id: Scalars['Int'];
};


export type MutationPostReplyArgs = {
  input: PostReplyInput;
};


export type MutationToggleBanUserArgs = {
  userId: Scalars['ID'];
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

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UpdatePostInput = {
  id: Scalars['Int'];
  text: Scalars['String'];
};

export type DeletePostResponse = {
  __typename?: 'DeletePostResponse';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type PostReplyResponse = {
  __typename?: 'PostReplyResponse';
  post?: Maybe<Post>;
  error?: Maybe<Scalars['String']>;
};

export type PostReplyInput = {
  parentId: Scalars['Int'];
  text: Scalars['String'];
  originalPostId: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  accessToken?: Maybe<Scalars['String']>;
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
  & Pick<Post, 'id' | 'title' | 'level' | 'replies' | 'score' | 'voteCount' | 'voteStatus' | 'isLocked' | 'isPinned' | 'createdAt' | 'updatedAt'>
  & { author: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ), originalPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id'>
  )>, reply?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id'>
  )> }
);

export type PostContentFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'text' | 'flaggedAt'>
  & BasicPostFragment
);

export type PostReplyFragment = (
  { __typename?: 'Post' }
  & { parent?: Maybe<(
    { __typename?: 'Post' }
    & PostContentFragment
  )> }
  & PostContentFragment
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

export type RegularPostResponseFragment = (
  { __typename?: 'PostResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'text'>
    & BasicPostFragment
  )> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'verified' | 'isAdmin' | 'bannedUntil' | 'lastPostAt'>
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
    { __typename?: 'PostResponse' }
    & RegularPostResponseFragment
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & { deletePost: (
    { __typename?: 'DeletePostResponse' }
    & Pick<DeletePostResponse, 'success' | 'error'>
  ) }
);

export type FlagPostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FlagPostMutation = (
  { __typename?: 'Mutation' }
  & { flagPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'flaggedAt'>
  )> }
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

export type ToggleBanUserMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type ToggleBanUserMutation = (
  { __typename?: 'Mutation' }
  & { toggleBanUser: (
    { __typename?: 'User' }
    & RegularUserFragment
  ) }
);

export type ToggleLockThreadMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ToggleLockThreadMutation = (
  { __typename?: 'Mutation' }
  & { toggleLockThread?: Maybe<Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'isLocked'>
  )>> }
);

export type TogglePinThreadMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TogglePinThreadMutation = (
  { __typename?: 'Mutation' }
  & { togglePinThread?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'isPinned'>
  )> }
);

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'PostResponse' }
    & RegularPostResponseFragment
  ) }
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
  options: PostsInput;
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

export type ReplyQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ReplyQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostReplyFragment
  )> }
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
      & Pick<Payload, 'userId' | 'isAdmin' | 'bannedUntil' | 'tokenVersion'>
    )> }
  ) }
);

export type UserProfileQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UserProfileQuery = (
  { __typename?: 'Query' }
  & { userProfile?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'score' | 'lastActiveAt' | 'verified' | 'bannedUntil' | 'isAdmin' | 'createdAt'>
  )> }
);

export const BasicPostFragmentDoc = gql`
    fragment BasicPost on Post {
  id
  title
  author {
    id
    username
  }
  originalPost {
    id
  }
  reply {
    id
  }
  level
  replies
  score
  voteCount
  voteStatus
  isLocked
  isPinned
  createdAt
  updatedAt
}
    `;
export const PostContentFragmentDoc = gql`
    fragment PostContent on Post {
  ...BasicPost
  text
  flaggedAt
}
    ${BasicPostFragmentDoc}`;
export const PostReplyFragmentDoc = gql`
    fragment PostReply on Post {
  ...PostContent
  parent {
    ...PostContent
  }
}
    ${PostContentFragmentDoc}`;
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
export const RegularPostResponseFragmentDoc = gql`
    fragment RegularPostResponse on PostResponse {
  errors {
    ...RegularError
  }
  post {
    ...BasicPost
    text
  }
}
    ${RegularErrorFragmentDoc}
${BasicPostFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  verified
  isAdmin
  bannedUntil
  lastPostAt
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
    ...RegularPostResponse
  }
}
    ${RegularPostResponseFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id) {
    success
    error
  }
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const FlagPostDocument = gql`
    mutation FlagPost($id: Int!) {
  flagPost(id: $id) {
    id
    flaggedAt
  }
}
    `;

export function useFlagPostMutation() {
  return Urql.useMutation<FlagPostMutation, FlagPostMutationVariables>(FlagPostDocument);
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
export const ToggleBanUserDocument = gql`
    mutation ToggleBanUser($userId: ID!) {
  toggleBanUser(userId: $userId) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useToggleBanUserMutation() {
  return Urql.useMutation<ToggleBanUserMutation, ToggleBanUserMutationVariables>(ToggleBanUserDocument);
};
export const ToggleLockThreadDocument = gql`
    mutation ToggleLockThread($id: Int!) {
  toggleLockThread(id: $id) {
    id
    isLocked
  }
}
    `;

export function useToggleLockThreadMutation() {
  return Urql.useMutation<ToggleLockThreadMutation, ToggleLockThreadMutationVariables>(ToggleLockThreadDocument);
};
export const TogglePinThreadDocument = gql`
    mutation TogglePinThread($id: Int!) {
  togglePinThread(id: $id) {
    id
    isPinned
  }
}
    `;

export function useTogglePinThreadMutation() {
  return Urql.useMutation<TogglePinThreadMutation, TogglePinThreadMutationVariables>(TogglePinThreadDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    ...RegularPostResponse
  }
}
    ${RegularPostResponseFragmentDoc}`;

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
    query Posts($options: PostsInput!) {
  posts(options: $options) {
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
export const ReplyDocument = gql`
    query Reply($id: Int!) {
  post(id: $id) {
    ...PostReply
  }
}
    ${PostReplyFragmentDoc}`;

export function useReplyQuery(options: Omit<Urql.UseQueryArgs<ReplyQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ReplyQuery>({ query: ReplyDocument, ...options });
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
      bannedUntil
      tokenVersion
    }
  }
}
    `;

export function useTestTokenQuery(options: Omit<Urql.UseQueryArgs<TestTokenQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TestTokenQuery>({ query: TestTokenDocument, ...options });
};
export const UserProfileDocument = gql`
    query UserProfile($userId: ID!) {
  userProfile(userId: $userId) {
    id
    username
    email
    score
    lastActiveAt
    verified
    bannedUntil
    isAdmin
    createdAt
  }
}
    `;

export function useUserProfileQuery(options: Omit<Urql.UseQueryArgs<UserProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserProfileQuery>({ query: UserProfileDocument, ...options });
};