import { Link } from "wouter";

export default function Error({ type }) {
  let message;
  let subMessage = () => (
    <>
      Click{" "}
      <Link to="/" className="inline text-blue-600">
        here
      </Link>{" "}
      to go to home.
    </>
  );

  if (type === "404") {
    message = "Page or symbol not found.";
  } else if (type === "403") {
    message = "The resources are only available for paid subscribers.";
  } else if (type === "429") {
    message =
      "Too many fetch calls. Please take note that the API has a limit of 60 calls per minute.";
    subMessage = () => <>Please try again later.</>;
  } else {
    message = "Something went wrong.";
  }

  return (
    <div className="flex h-[calc(100vh-16px)] flex-col items-center justify-center rounded-md border border-gray-300 shadow">
      <h1 className="text-2xl font-bold">{type}</h1>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-sm font-medium">{subMessage()}</p>
    </div>
  );
}
