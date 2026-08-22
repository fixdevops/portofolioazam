import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function GithubActivity() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    supabase
      .from("profile")
      .select("github_username")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setUsername(data?.github_username || null);
      });
  }, []);

  if (!username) return null;

  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[18px] font-bold text-gray-800 flex items-center gap-2">
          <i className="ri-bar-chart-2-fill"></i> GitHub Activity
        </h2>
        <Link to="/github" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
          View more
        </Link>
      </div>
      <br />
      <div className="bg-white text-gray-800 border border-gray-200 p-5 rounded-xl max-w-full overflow-x-auto shadow-sm">
        <GitHubCalendar
          username={username}
          blockSize={11.4}
          colorScheme="light"
          fontSize={12}
        />
      </div>
    </div>
  );
}
