import UserPreferences from "../../components/UserPreferences";
import { NoSsr, Paper, withStyles } from "@material-ui/core";
import { updatepagepath } from "../../lib/store";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { getPath } from "../../lib/path";
import Head from 'next/head';
import dataFetch from '../../lib/data-fetch';

const styles = { paper : { maxWidth : '90%',
  margin : 'auto',
  overflow : 'hidden', } };

class UserPref extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  async componentDidMount() {
    console.log(`path: ${getPath()}`);
    this.props.updatepagepath({ path : getPath() });

    await new Promise(resolve => {
      dataFetch('/api/user/prefs', { credentials : 'same-origin',
        method : 'GET',
        credentials : 'include', }, (result) => {
        resolve();
        console.log(result);
        if (typeof result !== 'undefined') {
          this.setState({
            anonymousStats : result.anonymousUsageStats||false,
            perfResultStats : result.anonymousPerfResults||false,
            startOnZoom : result.usersExtensionPreferences.startOnZoom||false,
            checkedGrid : result.usersExtensionPreferences.canvasSettings.hideGrid||false,
            checkedSnap : result.usersExtensionPreferences.canvasSettings.snapToGrid||false
          });
        }
      },
      // Ignore error because we will fallback to default state
      // and to avoid try catch due to async await functions
      resolve);
    });
  }

  render () {
    const { anonymousStats, perfResultStats, startOnZoom, checkedGrid, checkedSnap }=this.state;
    console.log(this.state)
    if (anonymousStats==undefined){
      // Skip rendering till data is not loaded
      return <div></div>
    }
    return (
      <NoSsr>
        <Head>
          <title>Preferences | Meshery</title>
        </Head>
        <Paper className={this.props.classes.paper}>
          {/* {should meshmap specific user preferences be placed along with general preferences or from the remote provider} */}
          <UserPreferences anonymousStats={anonymousStats} perfResultStats={perfResultStats} startOnZoom={startOnZoom} checkedGrid={checkedGrid} checkedSnap={checkedSnap}/>
        </Paper>
      </NoSsr>
    );
  }
}

const mapDispatchToProps = dispatch => ({ updatepagepath : bindActionCreators(updatepagepath, dispatch) })

export default withStyles(styles)(connect(
  null,
  mapDispatchToProps
)(UserPref));