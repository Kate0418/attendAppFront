"use client"

import Loader from "@/components/layout/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Token from "@/api/Token";
import Page from "@/components/layout/Page";
import SubjectAdd from "@/api/SubjectAdd";
import Title from "@/components/layout/Title";
import { Button } from "@/components/layout/Button";
import { A } from "@/components/layout/A";
import { Select } from "@/components/layout/Select";

export default function () {
    const [teachers, setTeachers] = useState<Array<{id: number, name: string}>>([]);
    const [subjects, setSubjects] = useState<Array<{name: string, teacherId: number | null}>>([
        { name: "", teacherId: null }
      ]);
    const [confirm ,setConfirm] = useState(false);
    const [adds, setAdds] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => { // 正しいデータかの検証
        const count = subjects.filter(subject => subject.name).length;
        setAdds(count);
    }, [subjects]);

    const handleInputChange = (index: number, field: string, value: string | number) => {
        const updatedTables = [...subjects];
        updatedTables[index] = { ...updatedTables[index], [field]: value };
        setSubjects(updatedTables);
    };

    const addApi = async() => {
        setLoading(true);
        if (!await Token) {
            router.push("/site/login");
            setLoading(false);
        }

        const response = await SubjectAdd(subjects);
        alert(response.message);
        if (response.success) {
            router.push("/service/1/subject")
        } else {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Title title="科目登録ページ" />
            <Page title="登録科目一覧">
                <div className="flex flex-col items-center overflow-auto max-h-[430px]">
                    <table className="w-full mb-5">
                        <thead>
                            <tr className="border border-[var(--text-color)] bg-[var(--text-color)] text-[var(--base-color)]">
                                <td className="border-r border-[var(--base-color)] p-1 w-1/2">科目名</td>
                                <td className="p-1 w-1/2">講師名</td>
                            </tr>
                        </thead>
                        <tbody className="overflow-auto">
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td className="border border-[var(--text-color)]">
                                    <input type="text" className="w-full p-1"
                                    value={subject.name}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="border border-[var(--text-color)]">
                                    <select className="w-full p-1"
                                    value={subject.teacherId || ""}
                                    onChange={(e) => handleInputChange(index, 'teacherId', Number(e.target.value))}
                                    > 
                                        <option value="">選択なし</option>
                                        {/* ここにセレクトボックス */}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Page>
            <div className="flex justify-between w-full">
                    <A href="/service/1/subject">戻る</A>

                    <div className="flex">
                        <Button type="button" onClick={() => setSubjects([...subjects,{ name: "",teacherId: null }])}>追加</Button>
                        <Button type="button" onClick={() => subjects.length > 1 && setSubjects(subjects.slice(0, -1))}>削除</Button>
                        <Button type="button" onClick={() => subjects.length === adds ? setConfirm(true) : alert("科目情報を正しく入力してください")}>確認</Button>
                    </div>
                </div>

            {confirm && (
                <div className="fixed top-0 left-0 p-40">
                    <div className="fixed top-0 left-0 w-screen h-screen z-40 bg-[var(--text-color)] opacity-60"></div>
                    <div className="fixed bg-white z-50 inset-x-60 flex flex-col items-center p-8 rounded-lg h-[500px] overflow-auto">
                        <table className="w-11/12 mb-5">
                            <thead>
                                <tr className="border border-[var(--text-color)] bg-[var(--text-color)] text-[var(--base-color)]">
                                    <td className="border-r border-[var(--base-color)] p-1 w-1/2">科目名</td>
                                    <td className="p-1 w-1/2">講師名</td>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td className="border border-[var(--text-color)] p-1">{subject.name}</td>
                                        <td className="border border-[var(--text-color)] p-1">{subject.teacherId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end w-full">
                            <Button type="submit" onClick={() => { setConfirm(false) }}>戻る</Button>
                            <Button type="submit" onClick={() => { addApi() }}>登録</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}