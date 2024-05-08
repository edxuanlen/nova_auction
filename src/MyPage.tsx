import { Layout, Menu, Breadcrumb } from 'antd';
import App from './Wallet'; // 引入您的 App.tsx

const { Header, Content, Footer } = Layout;

const MyPage = () => {
    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">About</Menu.Item>
                    <Menu.Item key="3">Contact</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <App /> {/* 将您的 App.tsx 嵌入到此处 */}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                My App ©2023 Created by CodeMaker
            </Footer>
        </Layout>
    );
};

export default MyPage;
