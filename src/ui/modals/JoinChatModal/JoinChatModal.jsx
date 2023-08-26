import PropTypes from "prop-types";
import React, { useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { Button } from "../../components/Button/Button";
import { TextBox } from "../../components/TextBox";
import { ErrorCodes } from "@bubble-protocol/core";

export const JoinChatModal = ({ bubbleIn, onJoin, onCancel, onCompletion }) => {
  const [bubbleId, setBubbleId] = useState(bubbleIn);
  const [error, setError] = useState();
  const [chainError, setChainError] = useState();

  let invite = bubbleId;
  try {
    const url = new URL(bubbleId);
    invite = url.searchParams.get('chat');
  }
  catch(_) {}

  function join(delegation) {
    onJoin(invite, delegation).then(onCompletion)
      .catch(error => {
        if (error.code === ErrorCodes.BUBBLE_ERROR_BUBBLE_TERMINATED) setError(new Error('Chat no longer exists'));
        else if (error.code === ErrorCodes.BUBBLE_ERROR_PERMISSION_DENIED) setError(new Error('Permission denied'));
        else if (error.code === 'chain-missing' && error.chain) setChainError(error.chain);
        else setError(error);
      })
  }

  return (
    <Modal 
    onCancel={onCancel}
    contentCentered={true}
    title="Join Chat"
    subtitle="Join a chat created by someone else." 
    contents=
      <React.Fragment>
        <div className="step-frame">
          <p className="small-text">Paste the chat ID below to join</p>
          <TextBox text={invite} onChange={setBubbleId} valid={invite !== undefined} />
        </div>
        {error && <p className="small-text error-text">{error.message}</p>}
        {chainError && <div className="small-text error-text">The {chainError.name} chain is not available in your wallet.<br/>Visit <a href={"https://chainlist.org/?search="+chainError.id} target="_blank">chainlist.org</a> to add the chain to your wallet then try again.</div>}
        <Button title="Join" onClick={() => join()} disabled={invite === undefined} />
      </React.Fragment>
    />
  );
};

JoinChatModal.propTypes = {
  bubbleIn: PropTypes.string,
  onJoin: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCompletion: PropTypes.func,
};

