import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Input, Table, Space, Pagination as AntPagination, Modal } from "antd";

import { FaChevronRight } from "react-icons/fa6";
import { IoPricetagsSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import {
  deleteSupplierQuotationById,
  getAllSupplierQuotations,
  getQuotationPriceBySupplierQuotationId,
} from "../../../api";
import { MutatingDots } from "../../../components";
import ConfirmPopup from "../../../components/Dashboard/ConfirmPopup";
import ImportQuotation from "./ImportQuotation";
import { toast } from "react-toastify";
import moment from "moment";

const { Column } = Table;

function ListQuotation() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentQuotations, setCurrentQuotations] = useState([]);
  const [totalItems, setTotalItems] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(1);
  const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllSupplierQuotations(1, 100);
        if (response && response.isSuccess) {
          const formattedQuotations = response.result.data.map((quotation) => ({
            ...quotation,
            supplierPriceQuotation: {
              ...quotation.supplierPriceQuotation,
              date: format(
                new Date(quotation.supplierPriceQuotation.date),
                "dd/MM/yyyy"
              ),
            },
          }));
          setQuotations(formattedQuotations);
        }
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setQuotations([]);
      }
      setLoading(false);
    }

    fetchData();
  }, [isOpen, isDelete, isError]);

  useEffect(() => {
    if (quotations) {
      const filteredQuotations = quotations.filter((quotation) =>
        String(JSON.stringify(quotation))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      setTotalItems(filteredQuotations.length);

      setCurrentQuotations([]);
      const firstItem = currentPage * itemsPerPage - itemsPerPage;
      if (firstItem >= filteredQuotations.length) return;

      const lastIndex = Math.min(
        firstItem + itemsPerPage,
        filteredQuotations.length
      );
      setCurrentQuotations(filteredQuotations.slice(firstItem, lastIndex));
    }
  }, [currentPage, itemsPerPage, quotations, searchTerm]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const chooseItemPerPage = (itemNumber) => {
    setItemsPerPage(itemNumber);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openDeleteConfirmation = (quotationId) => {
    setDeleteConfirmation(quotationId);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      try {
        const response = await deleteSupplierQuotationById(deleteConfirmation);
        if (response && response.isSuccess) {
          toast.success("Quotation deleted successfully");
          setIsDelete(isDelete + 1);
        } else {
          if (response && response.messages && response.messages.length > 0) {
            toast.error(response.messages[0]);
          } else {
            toast.error("Error deleting quotation");
          }
        }
      } catch (error) {
        toast.error("Error deleting quotation:", error);
      } finally {
        closeDeleteConfirmation();
      }
    }
  };

  const fetchQuotationDetail = async (quotationId) => {
    try {
      const response = await getQuotationPriceBySupplierQuotationId(
        quotationId
      );
      if (response && response.isSuccess) {
        setSelectedQuotationDetail(response.result.data);

        if (response && response.isSuccess) {
          setSelectedQuotationDetail(response.result.data);
          setIsDetailModalVisible(true);
        }
      } else {
        // Xử lý khi có lỗi
      }
    } catch (error) {
      // Xử lý khi có lỗi
    }
  };
  const getUnitName = (unitMaterial) => {
    switch (unitMaterial) {
      case 0:
        return "Kg";
      case 1:
        return "M3";
      case 2:
        return "Bar";
      case 3:
        return "Item";
      default:
        return "";
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <MutatingDots />
        </div>
      ) : (
        <div className="flex flex-col p-8 text-gray-900">
          <div>
            <div className="flex items-center space-x-2 text-xl">
              <IoPricetagsSharp />
              <div>Supplier</div>
              <FaChevronRight />
              <div>Price Quotation</div>
              <FaChevronRight />
            </div>
            <div className="text-2xl text-green-400 font-semibold py-4">
              Quotation List
            </div>
          </div>
          <div className="px-3 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 mb-4">
                <div className="px-2">Search</div>
                <div>
                  <Input
                    type="text"
                    className="border px-2 py-1"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <ImportQuotation
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isError={isError}
                setIsError={setIsError}
              />
            </div>
            <Table
              dataSource={currentQuotations}
              pagination={false}
              rowKey={(record, index) =>
                `${record.supplierPriceQuotation.id}-${index}`
              }
            >
              <Column
                title="Name"
                dataIndex={[
                  "supplierPriceQuotation",
                  "supplier",
                  "supplierName",
                ]}
                key="supplierName"
              />
              <Column
                title="Date"
                dataIndex={["supplierPriceQuotation", "date"]}
                key="date"
              />
              <Column
                title="Operation"
                key="operation"
                render={(text, record) => (
                  <Space size="middle">
                    <div
                      className="cursor-pointer text-xl bg-red-400 hover:bg-red-500 px-4 py-1 rounded-md text-white"
                      onClick={() =>
                        openDeleteConfirmation(record.supplierPriceQuotation.id)
                      }
                    >
                      Delete
                    </div>
                    <div
                      onClick={() =>
                        fetchQuotationDetail(record.supplierPriceQuotation.id)
                      }
                      className="cursor-pointer text-xl bg-blue-400 hover:bg-blue-500 px-4 py-1 rounded-md text-white"
                    >
                      View detail
                    </div>
                  </Space>
                )}
              />
            </Table>
          </div>
          <div className="w-full p-5">
            {totalItems && (
              <AntPagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={totalItems}
                onChange={paginate}
                showSizeChanger
                onShowSizeChange={chooseItemPerPage}
              />
            )}
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <ConfirmPopup
          message="Are you sure you want to delete this quotation?"
          onConfirm={confirmDelete}
          onCancel={closeDeleteConfirmation}
        />
      )}
      <Modal
        title="Quotation Detail"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedQuotationDetail && (
          <Table
            dataSource={selectedQuotationDetail}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record.id}
          >
            <Column
              title="No"
              dataIndex="id"
              key="id"
              render={(text, record, index) => index + 1}
            />
            <Column title="MOQ" dataIndex="moq" key="moq" />
            <Column
              title="Material"
              key="material"
              render={(text, record) => <span>{record.material.name}</span>}
            />
            <Column
              title="Unit"
              key="unit"
              render={(text, record) => (
                <span>{getUnitName(record.material.unitMaterial)}</span>
              )}
            />
            <Column title="Price" dataIndex="price" key="price" />
            <Column
              title="Date"
              dataIndex="supplierPriceQuotation.date"
              key="date"
              render={(date) => moment(date).format("DD/MM/YYYY")}
            />
          </Table>
        )}
      </Modal>
    </>
  );
}

export default ListQuotation;
