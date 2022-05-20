import './AppLayout.less';
import * as React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Layout } from 'antd';
import {landingAppRouter } from '../Router/router.config';
import utils from '../../utils/utils';

const { Content } = Layout;

class LandingAppLayout extends React.Component<any> {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  render() {
    const {
      location: { pathname },
    } = this.props;

   // const { path } = this.props.match;
  //  const { collapsed } = this.state;

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
            <Header collapsed={this.state.collapsed} toggle={this.toggle} />
          </Layout.Header>
          <Content style={{ margin: 16 }}>
            <Switch>
              {landingAppRouter
                .filter((item: any) => !item.isLayout)
                .map((route: any, index: any) => (
                  <Route key={index} path={route.path} component={route.component} exact={route.exact} />
                ))}
                <Redirect from="/" to="/" />
            </Switch>
          </Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    );

    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default LandingAppLayout;
