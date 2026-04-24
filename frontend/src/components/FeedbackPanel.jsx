import { useState } from "react";

function FeedbackPanel({ feedbacks, onAddFeedback }) {
  const [text, setText] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }
    onAddFeedback(text.trim());
    setText("");
  }

  return (
    <section className="feedback-panel" aria-labelledby="feedbackTitle">
      <div>
        <p className="eyebrow">Feedback</p>
        <h2 id="feedbackTitle">Customer notes</h2>
      </div>

      <form onSubmit={submit}>
        <textarea
          onChange={(event) => setText(event.target.value)}
          placeholder="Write feedback..."
          rows="4"
          value={text}
        />
        <button className="submit-button" type="submit">
          Send
        </button>
      </form>

      {feedbacks.length > 0 && (
        <div className="feedback-list">
          {feedbacks.slice(-3).map((feedback) => (
            <p key={feedback.id}>{feedback.text}</p>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeedbackPanel;
