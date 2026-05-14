'use client';

import Image from 'next/image';
import { ArrowLeft, Eye, Loader2, Mail, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

type AuthView =
  | 'methods'
  | 'email-entry'
  | 'email-login'
  | 'email-register'
  | 'activation-required'
  | 'reset-password';
type Provider = 'google' | 'apple' | null;
type Feedback = {
  type: 'info' | 'success';
  message: string;
} | null;

const MOCK_EXISTING_USERS = new Set([
  'demo@photogrid.com',
  'creator@photogrid.app',
  'hello@example.com',
]);

const MOCK_PENDING_ACTIVATION_USERS = new Set(['inactive@photogrid.app']);

interface LoginContentProps {
  onClose?: () => void;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isExistingUser(email: string) {
  return MOCK_EXISTING_USERS.has(normalizeEmail(email));
}

function isPendingActivation(email: string, pendingActivationEmails: string[]) {
  const normalized = normalizeEmail(email);
  return (
    pendingActivationEmails.includes(normalized) ||
    MOCK_PENDING_ACTIVATION_USERS.has(normalized)
  );
}

function SideVisual({ onClose }: { onClose?: () => void }) {
  return (
    <div className="relative hidden h-full overflow-hidden bg-[linear-gradient(160deg,#f0c9f4_0%,#cfb2e7_35%,#cab8ef_60%,#c9c0fa_100%)] sm:block">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭登录弹窗"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition hover:bg-white/12 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <div className="absolute inset-x-6 top-9 z-10 text-center text-white">
        <h3 className="mx-auto max-w-[250px] text-[22px] font-bold leading-[1.16] tracking-tight">
          Unlimited Access to All
          <br />
          Features and All Platforms
        </h3>
      </div>
      <Image
        src="/login-hero-woman.png"
        alt="登录视觉图"
        fill
        priority
        className="object-cover object-[60%_center]"
        sizes="(min-width: 768px) 45vw, 0vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(202,168,239,0.24)_0%,rgba(202,168,239,0.04)_32%,rgba(202,168,239,0)_100%)]" />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs text-rose-500">{message}</p>;
}

function FeedbackPanel({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;

  const tone =
    feedback.type === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-sky-200 bg-sky-50 text-sky-700';

  return (
    <div className={`mt-4 rounded-lg border px-3.5 py-3 text-xs leading-5 ${tone}`}>
      {feedback.message}
    </div>
  );
}

function AuthTextInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  trailing,
  readOnly = false,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  trailing?: ReactNode;
  readOnly?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`h-12 w-full rounded-lg border border-[#d5deeb] px-4 pr-12 text-sm font-medium shadow-[0_1px_3px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-[#d3d3d3] ${
          readOnly
            ? 'bg-slate-50 text-slate-600'
            : 'bg-white text-slate-900 focus:border-[#a7c9ef] focus:ring-2 focus:ring-[#e7f2ff]'
        }`}
      />
      {trailing ? (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98a8c6]">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

function ProviderButton({
  icon,
  label,
  onClick,
  loading = false,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-12 w-full items-center gap-3 rounded-lg border border-slate-200 px-4 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-80"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : icon}
      </span>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
  );
}

function LoginMethods({
  onChooseEmail,
  onProviderAuth,
  providerLoading,
  feedback,
}: {
  onChooseEmail: () => void;
  onProviderAuth: (provider: Exclude<Provider, null>) => void;
  providerLoading: Provider;
  feedback: Feedback;
}) {
  return (
    <div className="max-w-[360px]">
      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        登录或注册 PhotoGrid
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        使用第三方账号快速继续，或通过邮箱登录与创建账号。
      </p>

      <div className="mt-7 space-y-3">
        <ProviderButton
          icon={<span className="text-xl font-semibold leading-none text-[#4285F4]">G</span>}
          label="继续使用 Google"
          onClick={() => onProviderAuth('google')}
          loading={providerLoading === 'google'}
        />
        <ProviderButton
          icon={<span className="text-xl font-semibold leading-none text-slate-900"></span>}
          label="继续使用 Apple"
          onClick={() => onProviderAuth('apple')}
          loading={providerLoading === 'apple'}
        />

        <div className="relative py-2">
          <div className="border-t border-slate-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            or
          </span>
        </div>

        <ProviderButton
          icon={<Mail className="h-4 w-4 text-slate-400" />}
          label="使用邮箱继续"
          onClick={onChooseEmail}
        />
      </div>

      <FeedbackPanel feedback={feedback} />

      <p className="mt-6 text-xs leading-6 text-slate-500">
        继续即表示您同意
        <button type="button" className="mx-1 font-medium text-slate-700 underline-offset-2 hover:underline">
          使用条款
        </button>
        和
        <button type="button" className="ml-1 font-medium text-slate-700 underline-offset-2 hover:underline">
          隐私政策
        </button>
      </p>
    </div>
  );
}

function EmailEntry({
  email,
  feedback,
  onEmailChange,
  onBack,
  onSubmit,
}: {
  email: string;
  feedback: Feedback;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    if (!isValidEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    onSubmit();
  };

  return (
    <div className="max-w-[320px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>返回</span>
      </button>

      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        使用邮箱继续
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        请输入邮箱地址，我们会根据账号状态引导你登录、创建账号或完成邮箱验证。
      </p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div>
          <AuthTextInput
            id="entry-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
          />
          <FieldError message={error} />
        </div>

        <button
          type="submit"
          className="mt-3 h-12 w-full rounded-lg bg-cyan-500 text-base font-semibold text-white transition hover:bg-cyan-600"
        >
          继续
        </button>
      </form>

      <FeedbackPanel feedback={feedback} />
    </div>
  );
}

function EmailLogin({
  email,
  password,
  feedback,
  onEmailChange,
  onPasswordChange,
  onBack,
  onSubmit,
  onForgotPassword,
}: {
  email: string;
  password: string;
  feedback: Feedback;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) nextErrors.email = '请输入邮箱地址';
    else if (!isValidEmail(email)) nextErrors.email = '请输入有效的邮箱地址';

    if (!password.trim()) nextErrors.password = '请输入密码';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-[320px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>返回</span>
      </button>

      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        登录到你的账号
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        请输入密码以继续登录。
      </p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div>
          <AuthTextInput
            id="login-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            readOnly
          />
        </div>

        <div>
          <AuthTextInput
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            trailing={
              <button
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((value) => !value)}
                className="transition hover:text-[#7f95b8]"
              >
                <Eye className="h-4.5 w-4.5" />
              </button>
            }
          />
          <FieldError message={errors.password} />
        </div>

        <div className="flex items-center justify-between pt-1 text-sm">
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-medium text-cyan-500 transition hover:text-cyan-600"
          >
            忘记?
          </button>
          <button
            type="button"
            onClick={onBack}
            className="font-medium text-slate-400 transition hover:text-slate-600"
          >
            更换邮箱
          </button>
        </div>

        <button
          type="submit"
          className="mt-3 h-12 w-full rounded-lg bg-cyan-500 text-base font-semibold text-white transition hover:bg-cyan-600"
        >
          登录
        </button>
      </form>

      <FeedbackPanel feedback={feedback} />
    </div>
  );
}

function EmailRegister({
  email,
  password,
  confirmPassword,
  feedback,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBack,
  onSubmit,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  feedback: Feedback;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) nextErrors.email = '请输入邮箱地址';
    else if (!isValidEmail(email)) nextErrors.email = '请输入有效的邮箱地址';

    if (!password.trim()) nextErrors.password = '请设置密码';
    else if (password.length < 8) nextErrors.password = '密码至少需要 8 位';

    if (!confirmPassword.trim()) nextErrors.confirmPassword = '请再次输入密码';
    else if (confirmPassword !== password) nextErrors.confirmPassword = '两次输入的密码不一致';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-[320px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>返回</span>
      </button>

      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        完成账号创建
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        这是一个新的邮箱地址。设置登录密码后即可创建账号。
      </p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div>
          <AuthTextInput
            id="register-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            readOnly
          />
        </div>

        <div>
          <AuthTextInput
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            trailing={
              <button
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((value) => !value)}
                className="transition hover:text-[#7f95b8]"
              >
                <Eye className="h-4.5 w-4.5" />
              </button>
            }
          />
          <FieldError message={errors.password} />
        </div>

        <div>
          <AuthTextInput
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Confirm Password"
            trailing={
              <button
                type="button"
                aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="transition hover:text-[#7f95b8]"
              >
                <Eye className="h-4.5 w-4.5" />
              </button>
            }
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        <p className="text-sm text-[#9f9f9f]">密码应为6-20个字符</p>

        <button
          type="submit"
          className="mt-3 h-12 w-full rounded-lg bg-cyan-500 text-base font-semibold text-white transition hover:bg-cyan-600"
        >
          注册
        </button>
      </form>

      <div className="mt-3.5 text-center text-[15px] text-[#999999]">
        已有账号？{' '}
        <button type="button" onClick={onBack} className="font-medium text-cyan-500 transition hover:text-cyan-600">
          登录
        </button>
      </div>

      <FeedbackPanel feedback={feedback} />
    </div>
  );
}

function ActivationRequired({
  email,
  onBackToEmail,
  onResend,
  onBackToLogin,
}: {
  email: string;
  onBackToEmail: () => void;
  onResend: () => void;
  onBackToLogin: () => void;
}) {
  return (
    <div className="max-w-[340px]">
      <button
        type="button"
        onClick={onBackToEmail}
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>返回</span>
      </button>

      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        请查收邮箱并完成验证
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        我们已向
        <span className="mx-1 font-semibold text-slate-700">{email}</span>
        发送验证邮件。点击邮件中的链接后，你将自动登录并返回首页。
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        完成验证后，邮件中的链接会自动登录并返回首页。若未自动跳转，你也可以返回登录继续操作。
      </p>

      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onResend}
          className="font-medium text-cyan-500 transition hover:text-cyan-600"
        >
          重新发送邮件
        </button>
        <button
          type="button"
          onClick={onBackToEmail}
          className="font-medium text-slate-400 transition hover:text-slate-600"
        >
          更换邮箱
        </button>
      </div>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-8 h-12 w-full rounded-lg bg-cyan-500 text-base font-semibold text-white transition hover:bg-cyan-600"
      >
        返回登录
      </button>
    </div>
  );
}

function ResetPassword({
  email,
  feedback,
  onEmailChange,
  onBack,
  onSubmit,
}: {
  email: string;
  feedback: Feedback;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    if (!isValidEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    onSubmit();
  };

  return (
    <div className="max-w-[320px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>返回</span>
      </button>

      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
        重设密码
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        输入注册邮箱，我们会将重设密码链接发送到该邮箱。
      </p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reset-email" className="mb-1.5 block text-xs font-medium text-slate-600">
            邮箱地址
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="name@company.com"
            className="h-11 w-full rounded-lg border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />
          <FieldError message={error} />
        </div>

        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-lg bg-cyan-500 text-base font-semibold text-white transition hover:bg-cyan-600"
        >
          发送重设链接
        </button>
      </form>

      <FeedbackPanel feedback={feedback} />
    </div>
  );
}

export function LoginContent({ onClose }: LoginContentProps) {
  const [view, setView] = useState<AuthView>('methods');
  const [providerLoading, setProviderLoading] = useState<Provider>(null);
  const [pendingActivationEmails, setPendingActivationEmails] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);

  const changeView = (nextView: AuthView) => {
    setFeedback(null);
    setView(nextView);
  };

  const handleProviderAuth = (provider: Exclude<Provider, null>) => {
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    setProviderLoading(provider);
    setFeedback({
      type: 'info',
      message: `${providerName} 登录入口已预留。接入 OAuth 后，这里会直接跳转到对应的授权流程。`,
    });

    window.setTimeout(() => {
      setProviderLoading((current) => (current === provider ? null : current));
    }, 900);
  };

  const handleEmailEntry = () => {
    if (isExistingUser(email)) {
      changeView('email-login');
      return;
    }

    if (isPendingActivation(email, pendingActivationEmails)) {
      changeView('activation-required');
      return;
    }

    setConfirmPassword('');
    changeView('email-register');
  };

  const handleEmailLogin = () => {
    if (isPendingActivation(email, pendingActivationEmails)) {
      setFeedback({
        type: 'info',
        message: `邮箱 ${email} 尚未完成验证，请先前往邮箱点击验证链接。`,
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: `已识别为已注册邮箱 ${email}。接入真实认证接口后，这里会直接完成登录。`,
    });
  };

  const handleEmailRegister = () => {
    const normalizedEmail = normalizeEmail(email);
    setPendingActivationEmails((current) =>
      current.includes(normalizedEmail) ? current : [...current, normalizedEmail]
    );
    setConfirmPassword('');
    changeView('activation-required');
  };

  const handleResetPassword = () => {
    setFeedback({
      type: 'success',
      message: `重设请求已提交。接入邮件服务后，我们会将重设密码链接发送至 ${email}。`,
    });
  };

  const handleResendActivation = () => {
    setFeedback({
      type: 'info',
      message: `验证邮件已重新发送至 ${email}。请前往邮箱点击链接完成验证。`,
    });
  };

  const handleContinueHome = () => {
    setFeedback({
      type: 'info',
      message: `邮箱 ${email} 尚未完成验证，请先前往邮箱点击验证链接后再登录。`,
    });
    changeView('email-login');
  };

  return (
    <div className="relative grid h-[500px] max-h-[calc(100vh-32px)] w-full max-w-[820px] overflow-hidden rounded-[20px] bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)] sm:grid-cols-[minmax(0,1fr)_minmax(290px,0.82fr)]">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭登录弹窗"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <div className="h-full overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 md:px-8">
        <div className="flex min-h-full flex-col justify-center">
          {view === 'methods' ? (
            <LoginMethods
              onChooseEmail={() => changeView('email-entry')}
              onProviderAuth={handleProviderAuth}
              providerLoading={providerLoading}
              feedback={feedback}
            />
          ) : null}

          {view === 'email-entry' ? (
            <EmailEntry
              email={email}
              feedback={feedback}
              onEmailChange={setEmail}
              onBack={() => changeView('methods')}
              onSubmit={handleEmailEntry}
            />
          ) : null}

          {view === 'email-login' ? (
            <EmailLogin
              email={email}
              password={password}
              feedback={feedback}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onBack={() => changeView('email-entry')}
              onSubmit={handleEmailLogin}
              onForgotPassword={() => changeView('reset-password')}
            />
          ) : null}

          {view === 'email-register' ? (
            <EmailRegister
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              feedback={feedback}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onBack={() => changeView('email-entry')}
              onSubmit={handleEmailRegister}
            />
          ) : null}

          {view === 'activation-required' ? (
            <ActivationRequired
              email={email}
              onBackToEmail={() => changeView('email-entry')}
              onResend={handleResendActivation}
              onBackToLogin={handleContinueHome}
            />
          ) : null}

          {view === 'reset-password' ? (
            <ResetPassword
              email={email}
              feedback={feedback}
              onEmailChange={setEmail}
              onBack={() => changeView('email-login')}
              onSubmit={handleResetPassword}
            />
          ) : null}
        </div>
      </div>

      <SideVisual onClose={onClose} />
    </div>
  );
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[3px]">
      <LoginContent onClose={onClose} />
    </div>
  );
}
