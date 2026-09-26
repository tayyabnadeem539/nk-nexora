import { ChevronRight } from '../common/Icons.jsx';

export default function ChatMessage({ message, onAction }) {
  if (message.from === 'user') {
    return <div className="chat-msg chat-msg-user">{message.text}</div>;
  }

  const { action } = message;
  return (
    <div className="chat-msg chat-msg-bot">
      <p>{message.text}</p>
      {action?.label && action?.route && (
        <a href={action.route} className="chat-action-btn" onClick={onAction}>
          {action.label}
          <ChevronRight />
        </a>
      )}
    </div>
  );
}
