import { TeacherResponse } from "@/api/Teacher";
import { TeacherUpdateProps } from "@/api/TeacherUpdate";
import { WithZoom } from "@/config";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useCallback } from "react";

type TeachersWithZoom = WithZoom<TeacherResponse["teachers"][number]>;

interface TeacherListTableProps {
  teachers: TeachersWithZoom[];
  setZoom: (e: TeachersWithZoom["id"]) => void;
  teacherIds: TeacherResponse["teacherIds"];
  checkIds: number[];
  setUpdateTeacher: React.Dispatch<React.SetStateAction<TeacherUpdateProps["teachers"][number]>>;
  setUpdateModalFlg: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export function TeacherListTable({
  teachers,
  setZoom,
  teacherIds,
  checkIds,
  setUpdateTeacher,
  setUpdateModalFlg,
  setCheckIds,
}: TeacherListTableProps) {
  const [allCheckFlg, setAllCheckFlg] = useState(false);
  const getAllCheckFlg = useCallback(() => {
    const sortTeacherIds = [...teacherIds].sort((a, b) => a - b);
    const sortCheckIds = [...checkIds].sort((a, b) => a - b);
    return JSON.stringify(sortTeacherIds) !== JSON.stringify(sortCheckIds);
  }, [teacherIds, checkIds]);

  useEffect(() => {
    if (!getAllCheckFlg()) setAllCheckFlg(true);
  }, [getAllCheckFlg]);

  return (
    <table className="w-full">
      <thead>
        <tr className="border border-text bg-text text-base">
          <td className="border-r border-base p-2 w-10">
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                className="scale-[2] accent-lime-600"
                checked={allCheckFlg}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAllCheckFlg(e.target.checked);
                  setCheckIds(getAllCheckFlg() ? teacherIds : []);
                }}
              />
            </div>
          </td>
          <td className="border-r border-base p-2">名前</td>
          <td className="border-r border-base p-2">メールアドレス</td>
          <td className="w-[50px] lg:w-[100px]"></td>
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher, index) => (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-text p-2">
                <div className="flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="scale-[2] accent-lime-600"
                    checked={checkIds.includes(teacher.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let newCheckIds;
                      if (e.target.checked) {
                        newCheckIds = [...checkIds, teacher.id];
                      } else {
                        setAllCheckFlg(false);
                        newCheckIds = checkIds.filter(
                          (id) => id !== teacher.id,
                        );
                      }
                      setCheckIds(newCheckIds);
                    }}
                  />
                </div>
              </td>
              <td className="border border-text lg:p-2">
              <button
                  className="text-text-0.6 hover:text-text underline"
                  onClick={() => {
                    setUpdateTeacher({
                      id: teacher.id,
                      name: teacher.name,
                      email: teacher.email,
                      subjectIds: teacher.subjects.map((subject) => subject.id),
                    });
                    setUpdateModalFlg(true);
                  }}
                >
                  {teacher.name}
                </button>
              </td>
              <td className="border border-text lg:p-2">{teacher.email}</td>
              <td className="border border-text lg:p-2">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(teacher.id);
                  }}
                >
                  <Image
                    className="lg:w-8"
                    src={
                      teacher.zoom ? "/img/zoom_out.svg" : "/img/zoom_in.svg"
                    }
                    alt="zoom"
                    width={24}
                    height={24}
                  />
                </button>
              </td>
            </tr>
            <tr className={teacher.zoom ? "" : "hidden"}>
              <td className="border border-text" colSpan={4}>
                <div className="flex">
                  <div className="bg-text text-base w-1/6 text-center p-1 lg:py-3 ">
                    科目
                  </div>
                  <div className="flex items-center py-1 px-6">
                    {teacher.subjects.map((subject) => subject.name).join(", ")}
                  </div>
                </div>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
