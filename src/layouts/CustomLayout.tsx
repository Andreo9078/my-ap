import { Button, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { useUser } from "../contexts/currentUserContext";

const { Header, Content, Footer } = Layout;

interface CustomLayoutProps {
  menuItems: any[];
  defaultSelectedKey: string;
  onMenuClick?: (key: string) => void;
  children?: React.ReactNode;
}

export const CustomLayout = ({
  menuItems,
  defaultSelectedKey,
  onMenuClick = () => {},
  children,
}: CustomLayoutProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { logout } = useUser();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={false}>
        <div className="demo-logo-vertical" />
        <Menu
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            overflowY: "auto",
            width: "200px",
          }}
          theme="dark"
          defaultSelectedKeys={[defaultSelectedKey]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => onMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button
            style={{ background: "white", marginRight: "20px" }}
            type="default"
            variant="outlined"
            color="danger"
            onClick={() => logout()}
          >
            Выход
          </Button>
        </Header>
        <Content
          style={{
            margin: "16px 16px",
            height: "100%",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          OL Production ©{new Date().getFullYear()} Created by some guy
        </Footer>
      </Layout>
    </Layout>
  );
};
