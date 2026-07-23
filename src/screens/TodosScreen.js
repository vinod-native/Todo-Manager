import React, {useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {useDispatch, useSelector} from 'react-redux';
import AppButton from '../components/AppButton';
import EditModal from '../components/EditModal';
import {
  addItem,
  deleteItem,
  toggleItem,
  updateItem,
} from '../store/todosSlice';
import {colors, shadows} from '../theme';

function TaskActionsModal({task, onClose, onEdit, onDelete}) {
  return (
    <Modal
      visible={Boolean(task)}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close task actions"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={[styles.actionMenu, shadows.card]}>
          <View style={styles.actionHeader}>
            <View style={styles.actionHeaderIcon}>
              <Ionicons
                name={task?.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={task?.completed ? colors.success : colors.primary}
              />
            </View>
            <View style={styles.actionHeaderCopy}>
              <Text style={styles.actionLabel}>TASK OPTIONS</Text>
              <Text style={styles.actionTitle} numberOfLines={2}>
                {task?.title}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}>
              <Ionicons name="close" size={21} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            style={({pressed}) => [
              styles.menuOption,
              pressed && styles.pressed,
            ]}>
            <View style={styles.optionIcon}>
              <Ionicons
                name="pencil-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Edit task</Text>
              <Text style={styles.optionText}>Update this task’s name</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.muted}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            style={({pressed}) => [
              styles.menuOption,
              styles.deleteOption,
              pressed && styles.pressed,
            ]}>
            <View style={[styles.optionIcon, styles.deleteOptionIcon]}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.danger}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={[styles.optionTitle, styles.deleteOptionTitle]}>
                Delete task
              </Text>
              <Text style={styles.optionText}>Permanently remove this task</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.muted}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function DeleteTaskModal({task, onCancel, onConfirm}) {
  return (
    <Modal
      visible={Boolean(task)}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close delete confirmation"
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <View style={[styles.deleteModal, shadows.card]}>
          <View style={styles.deleteModalIcon}>
            <Ionicons name="trash-outline" size={28} color={colors.danger} />
          </View>
          <Text style={styles.deleteModalTitle}>Delete this task?</Text>
          <Text style={styles.deleteTaskName} numberOfLines={2}>
            {task?.title}
          </Text>
          <Text style={styles.deleteModalText}>
            This task will be permanently removed from your list.
          </Text>
          <View style={styles.modalActions}>
            <AppButton
              style={styles.modalButton}
              variant="secondary"
              title="No, cancel"
              onPress={onCancel}
            />
            <AppButton
              style={[styles.modalButton, styles.confirmDeleteButton]}
              title="Yes, delete"
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function TodosScreen({route, navigation}) {
  const {listId} = route.params;
  const dispatch = useDispatch();
  const list = useSelector(state =>
    state.todos.lists.find(item => item.id === listId),
  );
  const [editing, setEditing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionTask, setActionTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useLayoutEffect(
    () => navigation.setOptions({title: list?.title || 'Tasks'}),
    [navigation, list?.title],
  );

  if (!list) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>This list no longer exists.</Text>
      </View>
    );
  }

  const openNewTask = () => {
    setEditing(null);
    setShowEditModal(true);
  };

  const openEditTask = task => {
    setEditing(task);
    setShowEditModal(true);
  };

  const completedCount = list.items.filter(item => item.completed).length;

  return (
    <View style={styles.page}>
      <View style={styles.progressHeader}>
        <View>
          <Text style={styles.progressEyebrow}>LIST PROGRESS</Text>
          <Text style={styles.progressText}>
            {list.items.length
              ? `${completedCount} of ${list.items.length} completed`
              : 'Add your first task'}
          </Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {list.items.length
              ? Math.round((completedCount / list.items.length) * 100)
              : 0}
            %
          </Text>
        </View>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          !list.items.length && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="checkmark-done-outline"
                size={35}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>
              Add a task and take the first step.
            </Text>
            <AppButton
              style={styles.emptyButton}
              title="Add your first task"
              onPress={openNewTask}
            />
          </View>
        }
        renderItem={({item}) => (
          <View style={[styles.taskCard, shadows.card]}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{checked: item.completed}}
              accessibilityLabel={`Mark ${item.title} as ${
                item.completed ? 'incomplete' : 'complete'
              }`}
              hitSlop={8}
              onPress={() => dispatch(toggleItem({listId, itemId: item.id}))}
              style={[styles.check, item.completed && styles.checked]}>
              {item.completed ? (
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              ) : null}
            </Pressable>
            <View style={styles.taskCopy}>
              <Text
                style={[styles.taskTitle, item.completed && styles.done]}
                numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.taskStatus}>
                {item.completed ? 'Completed' : 'To do'}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={`More options for ${item.title}`}
              hitSlop={8}
              onPress={() => setActionTask(item)}
              style={({pressed}) => [
                styles.moreButton,
                pressed && styles.pressed,
              ]}>
              <Ionicons
                name="ellipsis-horizontal"
                size={21}
                color={colors.text}
              />
            </Pressable>
          </View>
        )}
      />

      {list.items.length ? (
        <Pressable
          accessibilityLabel="Add task"
          onPress={openNewTask}
          style={({pressed}) => [styles.fab, pressed && styles.pressed]}>
          <Ionicons name="add" size={31} color="#FFFFFF" />
        </Pressable>
      ) : null}

      <EditModal
        visible={showEditModal}
        title={editing ? 'Edit task' : 'New task'}
        label="Task"
        initialValue={editing?.title}
        onCancel={() => setShowEditModal(false)}
        onSave={value => {
          dispatch(
            editing
              ? updateItem({listId, itemId: editing.id, title: value})
              : addItem(listId, value),
          );
          setShowEditModal(false);
        }}
      />
      <TaskActionsModal
        task={actionTask}
        onClose={() => setActionTask(null)}
        onEdit={() => {
          const selectedTask = actionTask;
          setActionTask(null);
          openEditTask(selectedTask);
        }}
        onDelete={() => {
          const selectedTask = actionTask;
          setActionTask(null);
          setDeleteTarget(selectedTask);
        }}
      />
      <DeleteTaskModal
        task={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          dispatch(deleteItem({listId, itemId: deleteTarget.id}));
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  progressHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressEyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  progressText: {
    marginTop: 4,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  progressBadge: {
    minWidth: 52,
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadgeText: {color: colors.primary, fontSize: 13, fontWeight: '900'},
  listContent: {padding: 18, paddingBottom: 104},
  emptyList: {flexGrow: 1, justifyContent: 'center'},
  taskCard: {
    minHeight: 74,
    marginBottom: 11,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#ECEEF5',
    borderRadius: 17,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {borderColor: colors.success, backgroundColor: colors.success},
  taskCopy: {minWidth: 0, flex: 1, marginHorizontal: 13},
  taskTitle: {color: colors.text, fontSize: 15, fontWeight: '700'},
  done: {color: colors.muted, textDecorationLine: 'line-through'},
  taskStatus: {marginTop: 4, color: colors.muted, fontSize: 11},
  moreButton: {
    width: 38,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {opacity: 0.62},
  centered: {alignItems: 'center', paddingHorizontal: 24},
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyText: {marginTop: 7, color: colors.muted, textAlign: 'center'},
  emptyButton: {alignSelf: 'stretch', marginTop: 20},
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  overlay: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(16,18,32,0.46)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMenu: {
    width: '100%',
    maxWidth: 370,
    padding: 10,
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  actionHeader: {
    padding: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionHeaderCopy: {minWidth: 0, flex: 1, marginLeft: 11},
  actionLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  actionTitle: {
    marginTop: 3,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  closeButton: {
    width: 35,
    height: 35,
    marginLeft: 8,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOption: {
    minHeight: 70,
    marginTop: 7,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCopy: {flex: 1, marginHorizontal: 12},
  optionTitle: {color: colors.text, fontSize: 15, fontWeight: '800'},
  optionText: {marginTop: 3, color: colors.muted, fontSize: 11},
  deleteOption: {marginTop: 1},
  deleteOptionIcon: {backgroundColor: '#FFF0F1'},
  deleteOptionTitle: {color: colors.danger},
  deleteModal: {
    width: '100%',
    maxWidth: 370,
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  deleteModalIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  deleteTaskName: {
    maxWidth: '100%',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    overflow: 'hidden',
    color: colors.text,
    backgroundColor: colors.background,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  deleteModalText: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  modalActions: {
    alignSelf: 'stretch',
    marginTop: 22,
    flexDirection: 'row',
  },
  modalButton: {flex: 1},
  confirmDeleteButton: {marginLeft: 10, backgroundColor: colors.danger},
});
