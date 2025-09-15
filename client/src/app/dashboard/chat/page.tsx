"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Avatar from "@/components/profile/Avatar";
import OnlineStatusDot from "@/components/profile/OnlineStatusDot";

const NewMatchesPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="main-container">
      {/* Breadcrumb */}
      {/* <div className="py-2">
        <Breadcrumb />
      </div> */}

      <div className="flex">
        <div className="w-[25%] px-2">
          <div className="h-12 border-b-slate-200 border-b-1">
            <h3 className="font-semibold text-black text-md mb-6">
              Recent Chats
            </h3>
          </div>
          <div>
            <div
              className={`flex items-center py-2 text-sm my-2 font-medium transition gap-2`}
            >
              <div className="w-[56px] h-[56px] rounded-full relative bg-slate-500">
                <Avatar
                  src={""}
                  firstname={"John"}
                  lastname={"Thomas"}
                  size={56}
                  hasBorder={false}
                />
                <div className="absolute bottom-0.5 right-0.5 z-10">
                  <OnlineStatusDot isOnline={true} size="md" />
                </div>
              </div>
              <div>
                <p>John Thomas</p>
                <p>Where are you now?</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50%] px-2">
          <div className="h-12 border-b-slate-200 border-b-1">
            <div className="flex items-center gap-2">
              <Avatar
                src={""}
                firstname={"John"}
                lastname={"Thomas"}
                size={56}
                hasBorder={false}
              />
              <div>
                <p>John Thomas</p>
                <div className="flex items-center gap-2">
                  <OnlineStatusDot isOnline={true} size="md" />
                  <p>Online</p>
                </div>
              </div>
            </div>
          </div>
          <div className="">gfg</div>
        </div>
        <div className="w-[25%] px-2">
          <div className="h-12 border-b-slate-200 border-b-1">User details</div>
          <div className="">
            <div className="w-[160px] h-[160px] rounded-full relative mx-auto bg-slate-500  ">
              <Avatar
                src={""}
                firstname={"John"}
                lastname={"Thomas"}
                size={160}
              />
              <div className="absolute bottom-4.5 right-4.5 z-10">
                <OnlineStatusDot isOnline={true} size="md" />
              </div>
            </div>
            <p>John Thomas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMatchesPage;
