import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { FC } from 'react';
import AvatarView from '@ui/AvatarView';
import colors from '@utils/colors';
import { formatDate } from '@utils/date';

interface Props {
    avatar?: string;
    name: string;
    timestamp: string;
    lastMessage: string;
    unreadMessageCount: number

}

const {width} = Dimensions.get('window')
const itemWidth = width - 30
const profileImageSize = 50
const seperatorWidth = width - profileImageSize - 45


const RecentChat: FC<Props> = ({avatar, name, timestamp, lastMessage, unreadMessageCount}) => {
  
const showNotification = unreadMessageCount > 0

  return (
    
    <View style={styles.container}>
        <AvatarView uri={avatar} size={profileImageSize} />
        <View style={styles.chatInfo}>
          <View style={styles.flexJustifyBetween}>
            <View style={styles.flex1}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail' >{name}</Text>
            </View>
            <Text style={showNotification ? styles.activeText : styles.inActiveText} numberOfLines={1} ellipsizeMode='tail' >
              {formatDate(timestamp)}</Text>
          </View>
          <View style={styles.flexJustifyBetween}>
            <View style={styles.flex1}>
            <Text style={styles.commonText} numberOfLines={2} ellipsizeMode='tail' >{lastMessage}</Text>
            </View>
            {showNotification &&
             <View style={styles.msgIndicator}>
            <Text style={styles.msgIndicatorCount}>{unreadMessageCount}</Text>
            </View>}
          </View >
      </View >
    </View>

  );
};

export const Seperator = () => <View style={styles.seperator}/>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: itemWidth,
  },
  chatInfo: {
    width: itemWidth - profileImageSize,
    paddingLeft: 15
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
    marginRight: 5
  },
  commonText: {
    fontSize: 12,
    color: colors.primary
  },
  activeText: {
    fontSize: 12,
    color: colors.active
  },
  inActiveText: {
    fontSize: 12,
    color: colors.primary
  },
  flexJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flex1: {
    flex: 1
  },
  msgIndicatorCount: {
    fontSize: 12,
    color: colors.white
  },
  msgIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.active,
    alignItems: 'center',
    justifyContent: 'center'
  },
  seperator: {
    width: seperatorWidth,
    height: 1,
    backgroundColor: colors.deActive,
    alignSelf: 'flex-end',
    marginVertical: 15,
  }
});

export default RecentChat;