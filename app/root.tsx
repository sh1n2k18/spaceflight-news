import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { css } from "styled-system/css";
import SkipNav from "./components/SkipNav";

import "./index.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => [
  { title: "Spaceflight News - Latest Space Mission Updates" },
  {
    name: "description",
    content:
      "Stay updated with the latest spaceflight news, mission updates, and space exploration stories from around the world.",
  },
  {
    name: "keywords",
    content:
      "spaceflight, space news, missions, rockets, NASA, SpaceX, space exploration",
  },
  { name: "author", content: "Spaceflight News App" },
  {
    property: "og:title",
    content: "Spaceflight News - Latest Space Mission Updates",
  },
  {
    property: "og:description",
    content:
      "Stay updated with the latest spaceflight news, mission updates, and space exploration stories from around the world.",
  },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Spaceflight News - Latest Space Mission Updates",
  },
  {
    name: "twitter:description",
    content:
      "Stay updated with the latest spaceflight news, mission updates, and space exploration stories from around the world.",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1a202c" />
        <Meta />
        <Links />
      </head>
      <body>
        <SkipNav />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <title>Error - Spaceflight News</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div
            className={css({
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "gray.50",
            })}
          >
            <div
              className={css({
                maxWidth: "md",
                width: "full",
                backgroundColor: "white",
                boxShadow: "lg",
                borderRadius: "lg",
                padding: "6",
                textAlign: "center",
              })}
            >
              <h1
                className={css({
                  fontSize: "2xl",
                  fontWeight: "bold",
                  color: "gray.900",
                  marginBottom: "4",
                })}
              >
                {error.status} {error.statusText}
              </h1>
              <p
                className={css({
                  color: "gray.600",
                  marginBottom: "6",
                })}
              >
                {error.status === 404
                  ? "The page you're looking for doesn't exist."
                  : "Something went wrong. Please try again later."}
              </p>
              <a
                href="/"
                className={css({
                  display: "inline-block",
                  backgroundColor: "blue.600",
                  color: "white",
                  paddingX: "6",
                  paddingY: "2",
                  borderRadius: "md",
                  transition: "colors",
                  _hover: {
                    backgroundColor: "blue.700",
                  },
                })}
              >
                Go Home
              </a>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Error - Spaceflight News</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div
          className={css({
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "gray.50",
          })}
        >
          <div
            className={css({
              maxWidth: "md",
              width: "full",
              backgroundColor: "white",
              boxShadow: "lg",
              borderRadius: "lg",
              padding: "6",
              textAlign: "center",
            })}
          >
            <h1
              className={css({
                fontSize: "2xl",
                fontWeight: "bold",
                color: "gray.900",
                marginBottom: "4",
              })}
            >
              Oops! Something went wrong
            </h1>
            <p
              className={css({
                color: "gray.600",
                marginBottom: "6",
              })}
            >
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            <a
              href="/"
              className={css({
                display: "inline-block",
                backgroundColor: "blue.600",
                color: "white",
                paddingX: "6",
                paddingY: "2",
                borderRadius: "md",
                transition: "colors",
                _hover: {
                  backgroundColor: "blue.700",
                },
              })}
            >
              Go Home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
