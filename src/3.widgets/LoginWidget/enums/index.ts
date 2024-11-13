const LoginPages = {
    Login: "login",
    Register: "register",
    RecoveryPassword: "recoveryPassword",
    Main: "main"
} as const

type LoginPage = typeof LoginPages[keyof typeof LoginPages]

export { LoginPages, LoginPage }
