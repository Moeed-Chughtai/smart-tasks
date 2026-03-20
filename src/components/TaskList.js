import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Pressable,
  PanResponder, Animated, LayoutAnimation, UIManager,
  Platform, StyleSheet,
} from 'react-native';
import { formatDueDate } from '../utils/taskParser';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_H = 76; // card height + margin

const TaskList = ({ tasks, activeTab, onToggleTask, onDeleteTask, onReorder, onSendToTab }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [dragId, setDragId] = useState(null);

  const incomplete = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  // Refs for PanResponder closure access
  const dragRef = useRef(null);
  const incompleteRef = useRef(incomplete);
  incompleteRef.current = incomplete;
  const onReorderRef = useRef(onReorder);
  onReorderRef.current = onReorder;

  const dragY = useRef(new Animated.Value(0)).current;
  const panActive = useRef(false);

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, gs) => {
      return !!dragRef.current && Math.abs(gs.dy) > 4;
    },
    onPanResponderGrant: () => {
      panActive.current = true;
    },
    onPanResponderMove: (_, gs) => {
      dragY.setValue(gs.dy);
    },
    onPanResponderRelease: (_, gs) => {
      if (!dragRef.current) return;
      const items = incompleteRef.current;
      const fromIdx = items.findIndex(t => t.id === dragRef.current.id);
      const offset = Math.round(gs.dy / ITEM_H);
      const toIdx = Math.max(0, Math.min(items.length - 1, fromIdx + offset));

      if (fromIdx !== toIdx && fromIdx >= 0) {
        const reordered = [...items];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, moved);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onReorderRef.current(reordered.map(t => t.id));
      }

      dragY.setValue(0);
      dragRef.current = null;
      panActive.current = false;
      setDragId(null);
    },
    onPanResponderTerminate: () => {
      dragY.setValue(0);
      dragRef.current = null;
      panActive.current = false;
      setDragId(null);
    },
  })).current;

  const startDrag = (id, index) => {
    dragRef.current = { id, fromIndex: index };
    setDragId(id);
    setExpandedId(null);
  };

  const toggle = (id) => {
    if (dragId) return;
    setExpandedId(prev => prev === id ? null : id);
  };

  const renderCard = (item, index, isDraggable) => {
    const isDragging = dragId === item.id;
    const expanded = expandedId === item.id && !isDragging;
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
    const dateText = formatDueDate(item.dueDate);

    const cardInner = (
      <View style={[styles.card, item.completed && styles.cardDone, isDragging && styles.cardDragging]}>
        <View style={styles.row}>
          {isDraggable && (
            <View style={styles.gripArea}>
              <View style={styles.gripCol}>
                <View style={styles.gripDot} />
                <View style={styles.gripDot} />
                <View style={styles.gripDot} />
              </View>
              <View style={styles.gripCol}>
                <View style={styles.gripDot} />
                <View style={styles.gripDot} />
                <View style={styles.gripDot} />
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={() => onToggleTask(item.id)}
            style={styles.checkHit}
            activeOpacity={0.6}
          >
            <View style={[styles.check, item.completed && styles.checkDone]}>
              {item.completed && <Text style={styles.checkMark}>{'\u2713'}</Text>}
            </View>
          </TouchableOpacity>

          <Pressable style={styles.body} onPress={() => toggle(item.id)}>
            <Text style={[styles.title, item.completed && styles.titleDone]} numberOfLines={2}>
              {item.title}
            </Text>
            {dateText && (
              <View style={[styles.datePill, isOverdue && styles.datePillOverdue]}>
                <Text style={[styles.dateText, isOverdue && styles.dateTextOverdue]}>
                  {dateText}
                </Text>
              </View>
            )}
          </Pressable>

          <TouchableOpacity onPress={() => toggle(item.id)} style={styles.moreHit} activeOpacity={0.5}>
            <View style={styles.dots}>
              <View style={[styles.dot, expanded && styles.dotActive]} />
              <View style={[styles.dot, expanded && styles.dotActive]} />
              <View style={[styles.dot, expanded && styles.dotActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {expanded && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => { onSendToTab(item.id); setExpandedId(null); }}
              style={[styles.actBtn, styles.actBtnAccent]}
              activeOpacity={0.6}
            >
              <Text style={styles.actLabelAccent}>
                {activeTab === 'now' ? 'Later \u2192' : '\u2190 Now'}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => { onDeleteTask(item.id); setExpandedId(null); }}
              style={[styles.actBtn, styles.actBtnDanger]}
              activeOpacity={0.6}
            >
              <Text style={styles.actLabelDanger}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );

    if (isDraggable) {
      return (
        <Pressable
          key={item.id}
          onLongPress={() => startDrag(item.id, index)}
          delayLongPress={200}
          onPressOut={() => {
            // Cancel drag if pan never took over
            if (dragRef.current?.id === item.id && !panActive.current) {
              setTimeout(() => {
                if (dragRef.current?.id === item.id && !panActive.current) {
                  dragRef.current = null;
                  setDragId(null);
                }
              }, 100);
            }
          }}
        >
          <Animated.View style={[
            styles.itemSpacing,
            isDragging && { transform: [{ translateY: dragY }], zIndex: 999 },
          ]}>
            {cardInner}
          </Animated.View>
        </Pressable>
      );
    }

    return (
      <View key={item.id} style={styles.itemSpacing}>
        {cardInner}
      </View>
    );
  };

  if (incomplete.length === 0 && completed.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          {activeTab === 'now' ? 'No tasks yet' : 'Nothing here'}
        </Text>
        <Text style={styles.emptySub}>
          {activeTab === 'now' ? 'Add one above to get started' : 'Move tasks here from Now'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!dragId}
    >
      <View {...panResponder.panHandlers}>
        {incomplete.map((item, i) => renderCard(item, i, true))}
      </View>

      {completed.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.sectionTitle}>Completed</Text>
          {completed.map((item, i) => renderCard(item, i, false))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  itemSpacing: {
    marginBottom: 8,
  },
  completedSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8eaef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDone: {
    backgroundColor: '#fafbfc',
    borderColor: '#f0f1f3',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardDragging: {
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderColor: '#c8d0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    paddingLeft: 10,
    paddingRight: 8,
  },
  gripArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    paddingTop: 5,
    marginRight: 4,
    gap: 3,
  },
  gripCol: {
    gap: 3,
  },
  gripDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#d0d4db',
  },
  checkHit: {
    paddingTop: 1,
    paddingRight: 12,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ced2d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkDone: {
    backgroundColor: '#4f6ef7',
    borderColor: '#4f6ef7',
  },
  checkMark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: -1,
  },
  body: {
    flex: 1,
    paddingTop: 1,
  },
  title: {
    fontSize: 15,
    color: '#1a1d26',
    fontWeight: '500',
    lineHeight: 21,
  },
  titleDone: {
    color: '#a0a5b0',
    textDecorationLine: 'line-through',
  },
  datePill: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  datePillOverdue: {
    backgroundColor: '#fef3c7',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateTextOverdue: {
    color: '#b45309',
  },
  moreHit: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dots: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#c5c9d1',
  },
  dotActive: {
    backgroundColor: '#4f6ef7',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingBottom: 12,
    paddingTop: 10,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  actBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  actBtnAccent: {
    backgroundColor: '#eef0ff',
  },
  actBtnDanger: {
    backgroundColor: '#fef2f2',
  },
  actLabelAccent: {
    fontSize: 13,
    color: '#4f6ef7',
    fontWeight: '600',
  },
  actLabelDanger: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptySub: {
    fontSize: 13,
    color: '#c5c9d1',
    fontWeight: '400',
    marginTop: 4,
  },
});

export default TaskList;
