import { Modal, Pressable, View } from "react-native";

export function ModalWithClickOut({ children, modalVisible, setModalVisible }: {
  children: React.ReactNode;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className="items-center justify-center w-full h-full"
      >
        {/* Backdrop dim -- closes the modal when clicked */}
        <Pressable
          onPress={() => setModalVisible(false)}
          className="absolute top-0 left-0 w-full h-full" />
        {children}
      </View>
    </Modal>
  );
}
