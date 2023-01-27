// @ts-nocheck
import React from "react"
import NavBar from "../components/navbar"
import { DetailComponent } from "../components/detailcomponent"

export function Details({data, conStatus}) {
    return (
        <main>
            <NavBar conStatus={conStatus}/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">All Recorded Data</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
                <DetailComponent data={data}/>
            </div>
        </main>
        )
}