// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Button,
//   Select,
//   Upload,
//   message,
//   Spin,
//   Space,
// } from "antd";
// import {
//   UploadOutlined,
//   DeleteOutlined,
//   CheckOutlined,
// } from "@ant-design/icons";
// import { contentTypes } from "@/enums/contentType";

// import styles from "./styles/contentModal.module.css";
// import { IContent } from "@/provider/content-provider/context";
// import { useContentAction, useContentState } from "@/provider/content-provider";

// const { TextArea } = Input;
// const { Option } = Select;

// interface ContentModalProps {
//   visible: boolean;
//   onClose: () => void;
//   initialContent?: IContent | null;
//   title?: string;
// }

// const ContentModal: React.FC<ContentModalProps> = ({
//   visible,
//   onClose,
//   initialContent = null,
//   title = "Create Content",
// }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<any[]>([]);
//   const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
//   const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

//   const contentActions = useContentAction();
//   const contentState = useContentState();

//   const { isPending, isSuccess, isError } = contentState;
//   const isEditMode = Boolean(initialContent?.id);

//   // Reset form when modal is opened/closed or initialContent changes
//   useEffect(() => {
//     if (visible) {
//       if (initialContent) {
//         form.setFieldsValue({
//           title: initialContent.contentTitle,
//           description: initialContent.contentDescription,
//           contentType: initialContent.contentType,
//           textContent: initialContent.textContent,
//           orderNumber: initialContent.orderNumber,
//         });

//         if (initialContent.pdfUrl) {
//           setUploadedPdfUrl(initialContent.pdfUrl);
//           setFileList([
//             {
//               uid: "-1",
//               name: initialContent.pdfUrl.split("/").pop() || "document.pdf",
//               status: "done",
//               url: initialContent.pdfUrl,
//             },
//           ]);
//         } else {
//           setFileList([]);
//           setUploadedPdfUrl(null);
//         }
//       } else {
//         form.resetFields();
//         setFileList([]);
//         setUploadedPdfUrl(null);
//       }
//     }
//   }, [visible, initialContent, form]);

//   // Handle success and error states
//   useEffect(() => {
//     if (isSuccess && !isPending) {
//       if (isEditMode) {
//         message.success("Content updated successfully!");
//       } else {
//         message.success("Content created successfully!");
//       }
//       onClose();
//     }
//     if (isError && !isPending) {
//       message.error(
//         isEditMode ? "Failed to update content" : "Failed to create content"
//       );
//     }
//   }, [isSuccess, isError, isPending, isEditMode, onClose]);

//   // Handle form submission
//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       const content: IContent = {
//         ...initialContent,
//         contentTitle: values.title,
//         contentDescription: values.description,
//         contentType: values.contentType,
//         textContent: values.textContent,
//         orderNumber: values.orderNumber ? parseInt(values.orderNumber) : 0,
//         pdfUrl: uploadedPdfUrl || undefined,
//       };

//       if (isEditMode && content.id) {
//         await contentActions.updateContent(content);
//       } else {
//         await contentActions.createContent(content);
//       }
//     } catch (error) {
//       console.error("Form validation failed:", error);
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = async (info: any) => {
//     const { status } = info.file;

//     if (status === "done") {
//       const pdfUrl = info.file.response.url;
//       setUploadedPdfUrl(pdfUrl);

//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }

//     setFileList(info.fileList.slice(-1));
//   };

//   // Delete content
//   const handleDelete = async () => {
//     if (initialContent?.id) {
//       await contentActions.deleteContent(initialContent.id);
//       message.success("Content deleted successfully!");
//       setIsDeleteConfirmVisible(false);
//       onClose();
//     }
//   };

//   // Upload config
//   const uploadProps = {
//     name: "file",
//     action: "/api/upload",
//     headers: {
//       authorization:
//         "Bearer " +
//         (typeof window !== "undefined"
//           ? localStorage.getItem("token") || ""
//           : ""),
//     },
//     fileList,
//     onChange: handleFileUpload,
//     accept: ".pdf",
//     maxCount: 1,
//   };

//   return (
//     <>
//       <Modal
//         title={
//           <div className={styles.modalHeader}>
//             <div className={styles.headerContent}>
//               <div className={styles.collapseIcon}>▼</div>
//               <div className={styles.headerTitle}>{title}</div>
//               <div className={styles.headerRight}>Completed</div>
//             </div>
//             <div className={styles.progressBar}></div>
//           </div>
//         }
//         open={visible}
//         onCancel={onClose}
//         width={800}
//         footer={null}
//         className={styles.contentModal}
//         maskClosable={false}
//       >
//         <Spin spinning={isPending}>
//           <Form form={form} layout="vertical" className={styles.form}>
//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="title"
//                 label="Content Title"
//                 rules={[
//                   { required: true, message: "Please enter content title" },
//                 ]}
//                 className={styles.formItem}
//               >
//                 <Input placeholder="Enter title" />
//               </Form.Item>
//             </div>

//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="description"
//                 label="Content Description"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter content description",
//                   },
//                 ]}
//                 className={styles.formItem}
//               >
//                 <TextArea rows={4} placeholder="Enter description" />
//               </Form.Item>
//             </div>

//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="contentType"
//                 label="Content Type"
//                 rules={[
//                   { required: true, message: "Please select content type" },
//                 ]}
//                 className={styles.formItem}
//               >
//                 <Select placeholder="Select content type">
//                   {Object.entries(contentTypes)
//                     .filter(([key]) => isNaN(Number(key)))
//                     .map(([key, value]) => (
//                       <Option key={key} value={value}>
//                         {key}
//                       </Option>
//                     ))}
//                 </Select>
//               </Form.Item>
//             </div>

//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="textContent"
//                 label="Text Content"
//                 className={styles.formItem}
//               >
//                 <TextArea rows={6} placeholder="Enter text content" />
//               </Form.Item>
//             </div>

//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="orderNumber"
//                 label="Order Number"
//                 className={styles.formItem}
//               >
//                 <Input type="number" placeholder="Enter order number" />
//               </Form.Item>
//             </div>

//             <div className={styles.contentItem}>
//               <div className={styles.contentIcon}>
//                 <CheckOutlined className={styles.checkIcon} />
//               </div>
//               <Form.Item
//                 name="pdfFile"
//                 label="Upload PDF"
//                 className={styles.formItem}
//               >
//                 <Upload {...uploadProps}>
//                   <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
//                 </Upload>
//               </Form.Item>
//             </div>

//             <div className={styles.actionButtons}>
//               {isEditMode && (
//                 <Button
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={() => setIsDeleteConfirmVisible(true)}
//                 >
//                   Delete
//                 </Button>
//               )}
//               <Space>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button
//                   type="primary"
//                   onClick={handleSubmit}
//                   loading={isPending}
//                 >
//                   {isEditMode ? "Update" : "Create"}
//                 </Button>
//               </Space>
//             </div>
//           </Form>
//         </Spin>
//       </Modal>

//       <Modal
//         title="Confirm Delete"
//         open={isDeleteConfirmVisible}
//         onCancel={() => setIsDeleteConfirmVisible(false)}
//         onOk={handleDelete}
//         okText="Delete"
//         okButtonProps={{ danger: true }}
//       >
//         <p>
//           Are you sure you want to delete this content? This action cannot be
//           undone.
//         </p>
//       </Modal>
//     </>
//   );
// };

// export default ContentModal;
