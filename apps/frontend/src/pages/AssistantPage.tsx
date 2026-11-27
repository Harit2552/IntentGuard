import { useState, type FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockIntentService, type StructuredIntent } from '../services/intent';

type Message = { role: 'user' | 'assistant'; text: string };

export function AssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Describe a supported transaction. For example, I can draft a transfer from a natural-language instruction.' },
  ]);
  const [intent, setIntent] = useState<StructuredIntent | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || processing) return;
    const submitted = prompt.trim();
    setMessages((current) => [...current, { role: 'user', text: submitted }]);
    setPrompt('');
    setProcessing(true);
    setError('');
    const result = await mockIntentService.generate(submitted);
    setProcessing(false);
    if (!result.ok) {
      setError(result.error);
      setMessages((current) => [...current, { role: 'assistant', text: result.error }]);
      return;
    }
    setIntent(result.intent);
    setMessages((current) => [...current, { role: 'assistant', text: result.message }]);
  };

  const fillSuggestion = (text: string) => setPrompt(text);

  return (
    <div className="assistant-page">
      <section className="assistant-heading">
        <div><p className="muted">Mock AI workspace</p><h2>Transaction assistant</h2></div>
        <StatusBadge tone="info">Draft only</StatusBadge>
      </section>
      <div className="assistant-grid">
        <section className="conversation panel" aria-label="Conversation">
          <div className="conversation-head"><span className="mini-logo"><Icon name="spark" /></span><div><strong>IntentGuard AI</strong><small>Illustrative service</small></div></div>
          <div className="message-list" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === 'assistant' && <span className="message-avatar"><Icon name="spark" /></span>}
                <p>{message.text}</p>
              </div>
            ))}
            {processing && <div className="message assistant"><span className="message-avatar"><Icon name="spark" /></span><p className="typing">Generating draft<span>•••</span></p></div>}
          </div>
          <div className="suggestions" aria-label="Suggested prompts">
            {[
              'Send 0.05 ETH to 0x1234... and keep it below my daily limit',
              'Transfer 0.01 ETH to 0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            ].map((suggestion) => <button type="button" key={suggestion} onClick={() => fillSuggestion(suggestion)}>{suggestion}</button>)}
          </div>
          <form className="prompt-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="transaction-prompt">Natural-language transaction instruction</label>
            <textarea id="transaction-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the transaction you want to make..." rows={3} />
            <button className="button button-primary prompt-send" type="submit" disabled={!prompt.trim() || processing}><Icon name="arrow" /><span>Send</span></button>
          </form>
        </section>

        <aside className="intent-preview panel" aria-label="Structured intent preview">
          <div className="panel-head"><div><p>Structured output</p><h3>Intent preview</h3></div>{intent && <StatusBadge tone="warning">Draft</StatusBadge>}</div>
          {intent ? (
            <>
              <div className="intent-meta"><span>Intent ID</span><strong className="mono">{intent.id}</strong></div>
              <dl className="intent-details">
                <div><dt>Operation</dt><dd>{intent.operation}</dd></div>
                <div><dt>Amount</dt><dd>{intent.amount} {intent.asset}</dd></div>
                <div><dt>Recipient</dt><dd className="mono">{intent.recipient}</dd></div>
                <div><dt>Network</dt><dd>{intent.network}</dd></div>
                <div><dt>Limit</dt><dd>{intent.limit}</dd></div>
              </dl>
              <div className="draft-notice"><Icon name="lock" /><p>This is an untrusted draft. It has not been policy checked or approved.</p></div>
              <NavLink className="button button-primary button-full" to={`/app/intents/${intent.id}`}>Continue to review <Icon name="arrow" /></NavLink>
            </>
          ) : (
            <div className="intent-empty"><Icon name="spark" /><h3>No draft yet</h3><p>Send an instruction to generate a structured preview.</p>{error && <p className="intent-error" role="alert">{error}</p>}</div>
          )}
        </aside>
      </div>
    </div>
  );
}
