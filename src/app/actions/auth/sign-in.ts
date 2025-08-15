// // app/actions/auth/login.ts
// "use server";
//
// export async function ActionUserLogin(formData: FormData) {
//   const email = String(formData.get("email") ?? "")
//     .trim()
//     .toLowerCase();
//   const password = String(formData.get("password") ?? "");
//
//   try {
//     await signIn("Credentials", { redirect: false, email, password });
//     return { status: "ok" as const };
//   } catch (e: any) {
//     const type = e?.type || e?.name;
//     if (type === "CredentialsSignin") {
//       return { status: "error" as const, error: "Неверный e-mail или пароль" };
//     }
//     const msg =
//       e?.cause?.err?.message ??
//       e?.message ??
//       "Не удалось войти. Попробуйте позже";
//     return { status: "error" as const, error: msg };
//   }
// }
