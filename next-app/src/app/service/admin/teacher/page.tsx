"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Title } from "@/components/layout/Title";
import { List } from "@/components/layout/List";
import { Teacher, TeacherResponse } from "@/api/Teacher";
import { Pagination } from "@/components/layout/Pagination";
import { TeacherListTable } from "@/components/service/admin/teacher/teacherListTable/teacherListTable";
import { WithZoom } from "@/config";
import { TeacherUpdate, TeacherUpdateProps } from "@/api/TeacherUpdate";
import { Modal } from "@/components/layout/Modal";
import { TeacherUpdateModalTable } from "@/components/service/admin/teacher/teacherUpdateModalTable/teacherUpdateModalTable";
import { UpdateController } from "@/components/layout/updateController/updateController";
import { Token } from "@/api/Token";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/layout/Loader";
import { EditToolbar } from "@/components/layout/editToolbar/editToolbar";
import { TeacherDestroy } from "@/api/TeacherDestroy";

type TeachersWithZoom = WithZoom<TeacherResponse["teachers"][number]>;

export default function Page() {
  const [keyWord, setKeyWord] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [teachers, setTeachers] = useState<TeachersWithZoom[]>([]);
  const [teacherIds, setTeacherIds] = useState<TeacherResponse["teacherIds"]>(
    [],
  );
  const [loaderFlg, setLoaderFlg] = useState(false);
  const [updateModalFlg, setUpdateModalFlg] = useState(false);
  const [updateTeacher, setUpdateTeacher] = useState<
    TeacherUpdateProps["teachers"][number]
  >({ id: 0, name: "", email: "",subjectIds: null});
  const [updateFlg, setUpdateFlg] = useState(false);

  const [total, setTotal] = useState(0);
  const [checkIds, setCheckIds] = useState<number[]>([]);

  const router = useRouter();

  const indexApi = useCallback(async () => {
    setLoaderFlg(true);
    const response = await Teacher({ keyWord, pageCount });
    setTeachers(
      response.teachers.map((teacher) => ({
        ...teacher,
        zoom: false,
      })),
    );
    setTeacherIds(response.teacherIds);
    setTotal(response.total);
    setLoaderFlg(false);
  }, [keyWord, pageCount]);

  useEffect(() => {
    indexApi();
  }, [indexApi]);

  const updateApi = async () => {
    setUpdateFlg(true);
    const token = await Token();
    if (!token.success) {
      router.push("/site/login");
      setUpdateFlg(false);
    }

    const response = await TeacherUpdate({ teachers: [updateTeacher] });
    alert(response.message);
    if (response.success) {
      router.push("/service/admin/teacher");
    }
    setUpdateFlg(false);
    indexApi();
  };

  const destroyApi = async() => {
    setUpdateFlg(true);
    const token = await Token();
    if (!token.success) {
      router.push("/site/login");
      setUpdateFlg(false);
    }

    const response = await TeacherDestroy({ teacherIds: checkIds});
    alert(response.message);
    setCheckIds([]);
    setUpdateFlg(false);
    indexApi();
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchWord = formData.get("keyWord") as string;
    setKeyWord(searchWord);
    setCheckIds([]);
  };

  const setZoom = (id: TeachersWithZoom["id"]) => {
    setTeachers((rows) =>
      rows.map((row) => (row.id === id ? { ...row, zoom: !row.zoom } : row)),
    );
  };

  if (updateFlg) return <Loader />;

  return (
    <>
      <Title title="講師情報管理" icon="teacher" />
      <List title="講師一覧" h={550} loaderFlg={loaderFlg}>
        <div className="flex justify-end items-center">
          <form onSubmit={handleSearch}>
            <label>検索ワード：</label>
            <input
              className="p-1 border border-text"
              name="keyWord"
              defaultValue={keyWord}
            />
            <button className="button !p-1 lg:!p-2" type="submit">
              検索
            </button>
          </form>
          <a className="a !p-1 lg:!p-2" href="/service/admin/teacher/store">
            新規作成
          </a>
        </div>
        <TeacherListTable
          teachers={teachers}
          setZoom={setZoom}
          checkIds={checkIds}
          setCheckIds={setCheckIds}
          setUpdateTeacher={setUpdateTeacher}
          setUpdateModalFlg={setUpdateModalFlg}
          teacherIds={teacherIds}
        />
      </List>
      <Pagination
        total={total}
        pageCount={pageCount}
        setPageCount={setPageCount}
      />

      <Modal
        className="!w-[720px] !h-64"
        modalFlg={updateModalFlg}
        setModalFlg={setUpdateModalFlg}
      >
        <div className="flex flex-col gap-4">
          <TeacherUpdateModalTable
            updateTeacher={updateTeacher}
            setUpdateTeacher={setUpdateTeacher}
          />
          <UpdateController
            setModalFlg={setUpdateModalFlg}
            updateOnClick={() => {
              updateApi();
            }}
          />
        </div>
      </Modal>

      <EditToolbar
        isShow={checkIds.length !== 0}
        onClickEdit={() => console.log()}
        onClickDelete={() => destroyApi()}
      />
    </>
  );
}
