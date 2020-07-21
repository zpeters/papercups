import React from 'react';
import {Box, Flex} from 'theme-ui';
import dayjs from 'dayjs';
import {
  colors,
  notification,
  Button,
  Checkbox,
  Divider,
  Input,
  Paragraph,
  Table,
  Text,
  Title,
} from '../common';
import {SmileTwoTone} from '../icons';
import * as API from '../../api';
import {BASE_URL} from '../../config';

type Props = {};
type State = {
  account: any;
  currentUser: any;
  inviteUrl: string;
};

class AccountOverview extends React.Component<Props, State> {
  input: any = null;

  state: State = {account: null, currentUser: null, inviteUrl: ''};

  async componentDidMount() {
    const [account, currentUser] = await Promise.all([
      API.fetchAccountInfo(),
      API.me(),
    ]);

    this.setState({account, currentUser});
  }

  handleGenerateInviteUrl = async () => {
    const {id: token} = await API.generateUserInvitation();

    this.setState(
      {
        inviteUrl: `${BASE_URL}/register/${token}`,
      },
      () => this.focusAndHighlightInput()
    );
  };

  focusAndHighlightInput = () => {
    if (!this.input) {
      return;
    }

    this.input.focus();
    this.input.select();

    if (document.queryCommandSupported('copy')) {
      document.execCommand('copy');
      notification.open({
        message: 'Copied to clipboard!',
        description:
          'You can now paste your unique invitation URL to a teammate.',
      });
    }
  };

  updateEmailNotificationSetting = async (e: any) => {
    try {
      const shouldReceiveEmailAlert = e.target.checked;
      await API.updateEmailNotificationSetting(shouldReceiveEmailAlert);
      const currentUser = await API.me();

      this.setState({currentUser});
    } catch (err) {
      console.log('Error!', err);
    }
  };

  renderUsersTable = (users: Array<any>) => {
    const {currentUser} = this.state;
    const data = users.map((u) => {
      return {...u, key: u.id, name: '--'};
    });

    const columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (value: string, record: any) => {
          if (currentUser && record.id === currentUser.id) {
            return (
              <Flex sx={{alignItems: 'center'}}>
                <Text strong>{value}</Text>
                <SmileTwoTone
                  style={{fontSize: 16, marginLeft: 4}}
                  twoToneColor={colors.primary}
                />
              </Flex>
            );
          }

          return value;
        },
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Member since',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value: string) => {
          const formatted = dayjs(value).format('MMMM DD, YYYY');

          return formatted;
        },
      },
    ];

    return <Table dataSource={data} columns={columns} />;
  };

  render() {
    const {account, inviteUrl, currentUser} = this.state;

    if (!account || !currentUser) {
      return null;
    }

    const {id: token, users = []} = account;
    const {
      email_alert_on_new_message: shouldReceiveEmailAlert = false,
    } = currentUser;

    return (
      <Box p={4}>
        <Box>
          <Title level={3}>Account Overview</Title>
          <Paragraph>
            <Text>This is your account token: </Text>
            <Text strong keyboard copyable>
              {token}
            </Text>
          </Paragraph>
        </Box>

        <Divider />

        <Box>
          <Title level={4}>Notifications</Title>
          <Paragraph>
            <Checkbox
              checked={shouldReceiveEmailAlert}
              onChange={this.updateEmailNotificationSetting}
            >
              Receive messages via email
            </Checkbox>
          </Paragraph>
        </Box>

        <Divider />

        <Box>
          <Title level={4}>Invite new teammate</Title>

          <Paragraph>
            <Text>
              Generate a unique invitation URL below and send it to your
              teammate.
            </Text>
          </Paragraph>

          <Flex sx={{maxWidth: 640}}>
            <Box sx={{flex: 1}} mr={1}>
              <Input
                ref={(el) => (this.input = el)}
                type="text"
                placeholder="Click the button to generate an invite URL!"
                value={inviteUrl}
              ></Input>
            </Box>
            <Box>
              <Button type="primary" onClick={this.handleGenerateInviteUrl}>
                Generate invite URL
              </Button>
            </Box>
          </Flex>
        </Box>

        <Divider />

        <Box mb={4}>
          <Title level={4}>Team</Title>
          {this.renderUsersTable(users)}
        </Box>
      </Box>
    );
  }
}

export default AccountOverview;
