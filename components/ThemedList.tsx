import { View, StyleSheet, Text, TextInput, Switch } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type ThemedListProps = {
  index?: number;
  totalItems?: number;
  itemName: string;
  textValue?: string;
  switchValue?: boolean;
  disabled?: boolean;
  type: 'TextInput' | 'Switch' | 'Title' | 'Note';
  handleNumber?: React.Dispatch<React.SetStateAction<number>>;
  handleTextInput?: React.Dispatch<React.SetStateAction<string>>;
  handleSwitch?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ThemedList({ index, totalItems, itemName, textValue, switchValue, type, disabled, handleNumber, handleTextInput, handleSwitch }: ThemedListProps) {

  const textColor = useThemeColor({},'text');
  const listItemColor = useThemeColor({}, 'listItem');
  const listValueColor = useThemeColor({}, 'listValue');
  const listGapLineColor = useThemeColor({}, 'listGapLine');
  const backgroundColor = useThemeColor({}, 'background');

  const itemStyle = (index?:number, total?:number) => {
    if  (index === undefined || total === undefined) {
      return undefined;
    }
    
    borderBottomColor: 
    if (total === 1) {
      return [styles.itemBase, styles.firstItem, styles.lastItem, {backgroundColor: listItemColor}];
    } else if (index === 1) {
      return [styles.itemBase, styles.firstItem, styles.middleItem, {borderBottomColor: listGapLineColor, backgroundColor: listItemColor}];
    } else if (index === total) {
      return [styles.itemBase, styles.lastItem, {backgroundColor: listItemColor}];
    } else {
      return [styles.itemBase, styles.middleItem, {borderBottomColor: listGapLineColor, backgroundColor: listItemColor}];
    }
  }

  if (type === 'Title') {
    return (
        <View style={styles.container}>
          <Text style={[styles.sectionName, {color: listValueColor}]}>
            {itemName}
          </Text>
        </View>
    );
  } else if (type === 'TextInput') {
    return (
      <View style={styles.container}>
      <View style={[itemStyle(index,totalItems)]}>
        <Text style={[styles.itemName, {color: textColor}]}>
          {itemName}
        </Text>
        <TextInput
          style={[styles.itemInput, {color: listValueColor}]}
          onChangeText={handleTextInput}
          textAlign='right'
          value={textValue}
          maxLength={20}
          selectTextOnFocus={true}
          readOnly={disabled}
        />
      </View>
    </View>
    );
  } else if (type === 'Note') {
    return (
        <View style={styles.container}>
          <Text style={[styles.sectionNote, {color: listValueColor}]}>
            {itemName}
          </Text>
        </View>
    );
  } else if (type === 'Switch') {
    return (
      <View style={styles.container}>
        <View style={[itemStyle(index,totalItems)]}>
          <Text style={[styles.itemName, {color: textColor}]}>
            {itemName}
          </Text>
          <Switch
            style={styles.itemSwitch}
            trackColor={{false: backgroundColor, true: '#64C466'}}
            thumbColor={'#FFF'}
            onValueChange={handleSwitch}
            value={switchValue}
            disabled={disabled}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  sectionName: {
    fontSize: 15,
    fontFamily: 'System',
    width: '100%',
    textAlign: 'left',
    paddingLeft: 17,
    marginBottom: 10,
  },
  itemBase: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 43,
  },
  firstItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  middleItem: {
    borderColor: 'transparent',
    borderWidth: 1,
  }, 
  lastItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    paddingLeft: 17,
    fontSize: 17,
    fontFamily: 'System',
  },
  itemInput: {
    fontSize: 16,
    paddingRight: 17,
  },
  itemSwitch: {
    marginRight: 17,
  },
  sectionNote: {
    fontSize: 13,
    fontFamily: 'System',
    width: '100%',
    textAlign: 'left',
    paddingLeft: 17,
    paddingRight: 17,
    marginBottom: 30,
  },
});
