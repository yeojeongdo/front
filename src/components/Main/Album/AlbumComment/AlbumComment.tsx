import useAlbum from "hooks/redux/useAlbum";
import autosize from "autosize";
import {
  CommentInputContainer,
  CommentItemContainer,
  CommentListContainer,
} from "./albumCommentStyles";
import DefaultProfile from "assets/images/default_profile.svg";
import { useCallback, useEffect, VFC } from "react";
import ReactLoading from "react-loading";
import useInput from "hooks/useInput";
import useAuth from "hooks/redux/useAuth";

interface IAlbumCommentProps {
  commentInputRef: any;
}

const AlbumComment: VFC<IAlbumCommentProps> = ({ commentInputRef }) => {
  const { albumState, getComments, createComment, deleteComment, editComment } =
    useAlbum();
  const { authState } = useAuth();

  const [commentInput, onChangeCommentInput, setCommentInput] = useInput("");

  const handleCreateComment = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (commentInput.trim() && event.keyCode === 13 && !event.shiftKey) {
        interface ICreateCommentData {
          comment: string;
          id: number;
        }
        const data: ICreateCommentData = {
          comment: commentInput,
          id: albumState.album!.id,
        };

        createComment(data);
      }
    },
    [createComment, commentInput, albumState.album]
  );

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      deleteComment(commentId);
    },
    [deleteComment]
  );

  const handleEditComment = useCallback(
    (commentId: number) => {
      const data = { id: commentId, comment: "" };
      editComment(data);
    },
    [editComment]
  );

  useEffect(() => {
    //* 댓글 삭제 후 댓글리스트 렌더링
    if (albumState.deleteCommentDone && albumState.album?.id) {
      getComments(albumState.album.id);
    }
  }, [albumState.deleteCommentDone, albumState.album?.id, getComments]);

  useEffect(() => {
    //* 댓글 생성 후 댓글리스트 렌더링
    if (albumState.createCommentDone && albumState.album?.id) {
      getComments(albumState.album.id);
      setCommentInput("");
    }
  }, [
    albumState.createCommentDone,
    setCommentInput,
    getComments,
    albumState.album?.id,
  ]);

  useEffect(() => {
    if (commentInputRef.current) {
      autosize(commentInputRef.current);
    }
  }, [commentInputRef]);

  useEffect(() => {
    if (albumState.album?.id) {
      getComments(albumState.album?.id);
    }
  }, [albumState.album?.id, getComments]);

  return (
    <>
      {albumState.createCommentLoading ? (
        <ReactLoading />
      ) : (
        <CommentListContainer>
          {albumState.comments?.map((comment) => (
            <CommentItemContainer key={comment.id}>
              <span className="comment_userName">{comment.user.name}</span>
              <p className="comment_content">{comment.content}</p>
              {authState.myInfo?.id === comment.user.id && (
                <>
                  <button onClick={() => handleEditComment(comment.id)}>
                    수정
                  </button>
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    삭제
                  </button>
                </>
              )}
            </CommentItemContainer>
          ))}
        </CommentListContainer>
      )}
      <CommentInputContainer>
        <img
          src={albumState.album?.user.image || DefaultProfile}
          alt=""
          className="profile"
        />
        <textarea
          ref={commentInputRef}
          className="comment_input"
          placeholder="댓글을 입력하세요."
          value={commentInput}
          onChange={onChangeCommentInput}
          onKeyDown={handleCreateComment}
        />
      </CommentInputContainer>
    </>
  );
};

export default AlbumComment;
