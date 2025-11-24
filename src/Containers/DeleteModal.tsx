import { FC } from "react";
import Button from "./Button";
import { TriangleAlert } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  name?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, name, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900/75 animate__animated animate__fadeIn">
      <div className="animate__animated animate__fadeIn bg-white p-6 rounded-lg shadow-lg">
       <div className="flex gap-2">
        <TriangleAlert className="text-yellow-500"/> <h2 className="text-lg font-bold mb-4">Warning</h2>
       </div>
        <p>{`Are you sure to delete this ${name ?? ""} ?`}</p>
        <div className="flex justify-center gap-2 mt-4">
          <Button
            title="Confirm"
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onConfirm}
          />
          <Button
            title="Cancel"
            className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

