import React from "react";
const DashboardSkeleton = () => {
  return(
      <div className="flex p-3 items-center gap-4">
        <div className="rounded-full animate-pulse w-[8rem] h-[8rem] bg-slate-300 shadow-md"></div>
        <div className="space-y-2">
          <div className="rounded-lg animate-pulse w-[13rem] ps-2 h-[1.5rem] bg-slate-300 shadow-sm"></div>
          <div className="rounded-lg animate-pulse w-[13rem] ps-2 h-[1.5rem] bg-slate-300 shadow-sm"></div>
          <div className="rounded-lg animate-pulse w-[13rem] ps-2 h-[1.5rem] bg-slate-300 shadow-sm"></div>
        </div>
      </div>
  )
}
export default DashboardSkeleton;