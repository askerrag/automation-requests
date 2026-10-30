export function mapAuthError(message: string, fallback: string) {
  const text = message.toLowerCase();

  if (text.includes("invalid login credentials")) {
    return "Неверный email или пароль.";
  }

  if (
    text.includes("user already registered") ||
    text.includes("already been registered")
  ) {
    return "Пользователь с таким email уже зарегистрирован.";
  }

  if (text.includes("email not confirmed")) {
    return "Подтвердите почту, затем войдите.";
  }

  if (text.includes("password")) {
    return "Пароль должен быть не короче 6 символов.";
  }

  if (text.includes("unable to validate email") || text.includes("invalid email")) {
    return "Укажите корректную почту.";
  }

  if (text.includes("not authorized")) {
    return "Сервис не отправил письмо на эту почту. Попробуйте другой адрес или отключите подтверждение почты в Supabase.";
  }

  return fallback;
}
