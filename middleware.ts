// Removed Clerk-related middleware
export default function middleware(req, res, next) {
  next();
}

// Only run the middleware on the /tasks path
export const config = {
  matcher: [
    "/tasks(.*)",
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
