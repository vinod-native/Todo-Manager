import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import AppButton from '../components/AppButton';
import EditModal from '../components/EditModal';
import {logout} from '../store/authSlice';
import {
  addList,
  deleteList,
  selectTodoStats,
  updateList,
} from '../store/todosSlice';
import {colors, shadows} from '../theme';

function LogoutModal({visible, loading, onCancel, onConfirm}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <Pressable
          accessibilityLabel="Close logout confirmation"
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <View style={[styles.logoutModal, shadows.card]}>
          <View style={styles.logoutModalIcon}>
            <Ionicons name="log-out-outline" size={28} color={colors.danger} />
          </View>
          <Text style={styles.logoutModalTitle}>Log out?</Text>
          <Text style={styles.logoutModalText}>
            Are you sure you want to log out of your account?
          </Text>
          <View style={styles.modalActions}>
            <AppButton
              style={styles.modalButton}
              variant="secondary"
              title="No, stay"
              onPress={onCancel}
              disabled={loading}
            />
            <AppButton
              style={[styles.modalButton, styles.logoutButton]}
              title="Yes, log out"
              onPress={onConfirm}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ListActionsModal({list, onClose, onEdit, onDelete}) {
  return (
    <Modal
      visible={Boolean(list)}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.actionOverlay}>
        <Pressable
          accessibilityLabel="Close list actions"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={[styles.actionMenu, shadows.card]}>
          <View style={styles.actionMenuHeader}>
            <View style={styles.actionMenuIcon}>
              <Ionicons name="list-outline" size={21} color={colors.primary} />
            </View>
            <View style={styles.actionMenuCopy}>
              <Text style={styles.actionMenuLabel}>LIST OPTIONS</Text>
              <Text style={styles.actionMenuTitle} numberOfLines={1}>
                {list?.title}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={styles.actionMenuClose}>
              <Ionicons name="close" size={21} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            style={({pressed}) => [
              styles.menuOption,
              pressed && styles.menuOptionPressed,
            ]}>
            <View style={styles.menuOptionIcon}>
              <Ionicons
                name="pencil-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuOptionCopy}>
              <Text style={styles.menuOptionTitle}>Edit list</Text>
              <Text style={styles.menuOptionText}>
                Change the name of this list
              </Text>
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
              pressed && styles.menuOptionPressed,
            ]}>
            <View style={[styles.menuOptionIcon, styles.deleteOptionIcon]}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.danger}
              />
            </View>
            <View style={styles.menuOptionCopy}>
              <Text style={[styles.menuOptionTitle, styles.deleteOptionTitle]}>
                Delete list
              </Text>
              <Text style={styles.menuOptionText}>
                Remove this list and all its tasks
              </Text>
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

function DeleteListModal({list, onCancel, onConfirm}) {
  return (
    <Modal
      visible={Boolean(list)}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <Pressable
          accessibilityLabel="Close delete confirmation"
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <View style={[styles.logoutModal, shadows.card]}>
          <View style={styles.deleteModalIcon}>
            <Ionicons name="trash-outline" size={28} color={colors.danger} />
          </View>
          <Text style={styles.logoutModalTitle}>Delete this list?</Text>
          <Text style={styles.deleteListName} numberOfLines={1}>
            {list?.title}
          </Text>
          <Text style={styles.logoutModalText}>
            This list and all of its tasks will be permanently removed.
          </Text>
          <View style={styles.modalActions}>
            <AppButton
              style={styles.modalButton}
              variant="secondary"
              title="No, cancel"
              onPress={onCancel}
            />
            <AppButton
              style={[styles.modalButton, styles.logoutButton]}
              title="Yes, delete"
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ListsScreen({navigation}) {
  const dispatch = useDispatch();
  const lists = useSelector(state => state.todos.lists);
  const user = useSelector(state => state.auth.user);
  const authLoading = useSelector(state => state.auth.loading);
  const stats = useSelector(selectTodoStats);
  const [editing, setEditing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [actionList, setActionList] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const displayName =
    user?.name?.trim() || user?.email?.split('@')[0] || 'there';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const openNewList = () => {
    setEditing(null);
    setShowEditModal(true);
  };

  const openEditList = list => {
    setEditing(list);
    setShowEditModal(true);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setShowLogoutModal(false);
  };

  const renderList = ({item, index}) => {
    const completed = item.items.filter(task => task.completed).length;
    const progress = item.items.length
      ? Math.round((completed / item.items.length) * 100)
      : 0;

    return (
      <View style={[styles.listCard, shadows.card]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Todos', {listId: item.id})}
          style={({pressed}) => [
            styles.listMain,
            pressed && styles.cardPressed,
          ]}>
          <View
            style={[
              styles.listIcon,
              index % 3 === 1 && styles.listIconOrange,
              index % 3 === 2 && styles.listIconGreen,
            ]}>
            <Ionicons
              name={item.items.length ? 'list-outline' : 'folder-open-outline'}
              size={23}
              color={
                index % 3 === 1
                  ? '#D97B35'
                  : index % 3 === 2
                    ? colors.success
                    : colors.primary
              }
            />
          </View>
          <View style={styles.listDetails}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.listMeta}>
              {item.items.length
                ? `${completed} of ${item.items.length} tasks complete`
                : 'No tasks yet'}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.muted}
          />
        </Pressable>

        <View style={styles.cardFooter}>
          <View style={styles.listProgressTrack}>
            <View
              style={[styles.listProgressFill, {width: `${progress}%`}]}
            />
          </View>
          <Text style={styles.progressLabel}>{progress}%</Text>
          <Pressable
            accessibilityLabel={`More options for ${item.title}`}
            hitSlop={8}
            onPress={() => setActionList(item)}
            style={({pressed}) => [
              styles.moreButton,
              pressed && styles.menuOptionPressed,
            ]}>
            <Ionicons
              name="ellipsis-horizontal"
              size={21}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const listHeader = (
    <>
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.eyebrow}>YOUR DASHBOARD</Text>
          <Text style={styles.welcomeTitle}>Let’s get things done</Text>
        </View>
        <Text style={styles.dateLabel}>
          {new Date().toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.summaryLabel}>Overall progress</Text>
            <Text style={styles.summaryValue}>
              {stats.total
                ? `${stats.progress}% complete`
                : 'No tasks yet'}
            </Text>
            <Text style={styles.summaryTaskCount}>
              {stats.total
                ? `${stats.completed} of ${stats.total} tasks completed`
                : 'Add a task to start tracking progress'}
            </Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="checkmark-done"
              size={27}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.summaryProgressTrack}>
          <View
            style={[
              styles.summaryProgressFill,
              {width: `${stats.progress}%`},
            ]}
          />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{lists.length}</Text>
            <Text style={styles.statLabel}>Lists</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.remaining}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>My lists</Text>
          <Text style={styles.sectionSubtitle}>
            Open a list to manage its tasks
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={openNewList}
          style={({pressed}) => [
            styles.addSmallButton,
            pressed && styles.cardPressed,
          ]}>
          <Ionicons name="add" size={19} color="#FFFFFF" />
          <Text style={styles.addSmallText}>New</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.topHeader}>
        <View style={styles.userBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.userCopy}>
            <Text style={styles.greeting}>Hello, {displayName}</Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setShowLogoutModal(true)}
          style={({pressed}) => [
            styles.logoutIconButton,
            pressed && styles.cardPressed,
          ]}>
          <Ionicons name="log-out-outline" size={23} color={colors.danger} />
        </Pressable>
      </View>

      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderList}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="file-tray-stacked-outline"
                size={35}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Create your first list</Text>
            <Text style={styles.emptyText}>
              Keep work, personal goals, shopping and daily tasks neatly
              organized.
            </Text>
            <AppButton
              style={styles.emptyButton}
              title="Create a list"
              onPress={openNewList}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {lists.length ? (
        <Pressable
          accessibilityLabel="Add list"
          onPress={openNewList}
          style={({pressed}) => [styles.fab, pressed && styles.cardPressed]}>
          <Ionicons name="add" size={31} color="#FFFFFF" />
        </Pressable>
      ) : null}

      <EditModal
        visible={showEditModal}
        title={editing ? 'Rename list' : 'New list'}
        label="List name"
        initialValue={editing?.title}
        onCancel={() => setShowEditModal(false)}
        onSave={value => {
          dispatch(
            editing
              ? updateList({id: editing.id, title: value})
              : addList(value),
          );
          setShowEditModal(false);
        }}
      />
      <LogoutModal
        visible={showLogoutModal}
        loading={authLoading}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
      <ListActionsModal
        list={actionList}
        onClose={() => setActionList(null)}
        onEdit={() => {
          const selectedList = actionList;
          setActionList(null);
          openEditList(selectedList);
        }}
        onDelete={() => {
          const selectedList = actionList;
          setActionList(null);
          setDeleteTarget(selectedList);
        }}
      />
      <DeleteListModal
        list={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          dispatch(deleteList(deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  topHeader: {
    minHeight: 76,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userBlock: {minWidth: 0, flex: 1, flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {color: '#FFFFFF', fontSize: 18, fontWeight: '900'},
  userCopy: {minWidth: 0, flex: 1, marginLeft: 12},
  greeting: {color: colors.text, fontSize: 16, fontWeight: '900'},
  email: {maxWidth: 230, marginTop: 3, color: colors.muted, fontSize: 12},
  logoutIconButton: {
    width: 43,
    height: 43,
    marginLeft: 12,
    borderRadius: 14,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {padding: 20, paddingBottom: 112},
  welcomeRow: {
    marginTop: 2,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  welcomeTitle: {
    marginTop: 6,
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  dateLabel: {color: colors.muted, fontSize: 13, fontWeight: '700'},
  summaryCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.primary,
    ...shadows.card,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {color: '#DCDDFF', fontSize: 13, fontWeight: '700'},
  summaryValue: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryTaskCount: {
    marginTop: 5,
    color: '#DCDDFF',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryProgressTrack: {
    height: 8,
    marginTop: 19,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {flex: 1, alignItems: 'center'},
  statValue: {color: '#FFFFFF', fontSize: 19, fontWeight: '900'},
  statLabel: {marginTop: 3, color: '#DCDDFF', fontSize: 11},
  statDivider: {
    width: 1,
    height: 29,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {color: colors.text, fontSize: 20, fontWeight: '900'},
  sectionSubtitle: {marginTop: 3, color: colors.muted, fontSize: 12},
  addSmallButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSmallText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  listCard: {
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#ECEEF5',
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  listMain: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPressed: {opacity: 0.72},
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconOrange: {backgroundColor: '#FFF2E7'},
  listIconGreen: {backgroundColor: '#E8F7F0'},
  listDetails: {minWidth: 0, flex: 1, marginHorizontal: 12},
  listTitle: {color: colors.text, fontSize: 16, fontWeight: '800'},
  listMeta: {marginTop: 4, color: colors.muted, fontSize: 12},
  cardFooter: {
    minHeight: 43,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  listProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  progressLabel: {
    width: 39,
    marginLeft: 8,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  moreButton: {
    width: 36,
    height: 32,
    marginLeft: 4,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    marginTop: 4,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9DBE8',
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 17,
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  emptyText: {
    maxWidth: 280,
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyButton: {alignSelf: 'stretch', marginTop: 20},
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 25,
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  modalOverlay: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(16,18,32,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutModal: {
    width: '100%',
    maxWidth: 370,
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  logoutModalIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutModalTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  logoutModalText: {
    marginTop: 8,
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
  logoutButton: {marginLeft: 10, backgroundColor: colors.danger},
  deleteModalIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteListName: {
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
  actionOverlay: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(16,18,32,0.42)',
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
  actionMenuHeader: {
    padding: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMenuCopy: {minWidth: 0, flex: 1, marginLeft: 11},
  actionMenuLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  actionMenuTitle: {
    marginTop: 3,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  actionMenuClose: {
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
  menuOptionPressed: {opacity: 0.6},
  menuOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOptionCopy: {flex: 1, marginHorizontal: 12},
  menuOptionTitle: {color: colors.text, fontSize: 15, fontWeight: '800'},
  menuOptionText: {marginTop: 3, color: colors.muted, fontSize: 11},
  deleteOption: {marginTop: 1},
  deleteOptionIcon: {backgroundColor: '#FFF0F1'},
  deleteOptionTitle: {color: colors.danger},
});
