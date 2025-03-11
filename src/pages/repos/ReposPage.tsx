import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Avatar, Layout } from "antd";

import type { RootState } from "../../store/store";

import { RepoTable } from "./components/RepoTable";
import { CreateRepoButton } from "./components/CreateRepoButton";

import "./style.css";

const { Header, Content } = Layout;

export function ReposPage() {
  let navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <main className="repos-container">
      <Layout>
        <Header className="header">
          <CreateRepoButton login={user?.login} token={token} />
          <div className="logo">
            <div className="username">{user?.login || ""}</div>
            <Avatar src={user?.avatar_url} />
          </div>
        </Header>
        <Content className="content">
          <RepoTable login={user?.login} token={token} />
        </Content>
      </Layout>
    </main>
  );
}
