import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ activeTab, onTabChange, nowCount, laterCount }) => {
  return (
    <View style={styles.outer}>
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.seg, activeTab === 'now' && styles.segActive]}
          onPress={() => onTabChange('now')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segLabel, activeTab === 'now' && styles.segLabelActive]}>
            Now
          </Text>
          {nowCount > 0 && (
            <View style={[styles.badge, activeTab === 'now' && styles.badgeActive]}>
              <Text style={[styles.badgeNum, activeTab === 'now' && styles.badgeNumActive]}>
                {nowCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.seg, activeTab === 'later' && styles.segActive]}
          onPress={() => onTabChange('later')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segLabel, activeTab === 'later' && styles.segLabelActive]}>
            Later
          </Text>
          {laterCount > 0 && (
            <View style={[styles.badge, activeTab === 'later' && styles.badgeActive]}>
              <Text style={[styles.badgeNum, activeTab === 'later' && styles.badgeNumActive]}>
                {laterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
    backgroundColor: '#f5f6f8',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#e8eaef',
    borderRadius: 10,
    padding: 3,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 7,
  },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7c8291',
  },
  segLabelActive: {
    color: '#1a1d26',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#cdd1d9',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 1,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: '#4f6ef7',
  },
  badgeNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c8291',
  },
  badgeNumActive: {
    color: '#fff',
  },
});

export default Header;
