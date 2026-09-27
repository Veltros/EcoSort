import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllUserWilayah, getAllUsersForAssign } from "@/actions/pemantauan";
import { AssignUserDialog } from "@/components/pemantauan/assign-dialog";
import { RemoveUserButton } from "@/components/pemantauan/remove-button";
import { Users, MapPin, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PemantauanPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [wilayahList, allUsers] = await Promise.all([
    getAllUserWilayah(),
    getAllUsersForAssign(),
  ]);

  const totalRelasi = wilayahList.reduce(
    (acc, w) => acc + w._count.userWilayah,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Pemantauan Wilayah
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Kelola penugasan pemantauan wilayah oleh petugas kebersihan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E7E7E7] px-3 py-2 text-xs font-medium text-[#6B7280] shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-fit">
          <UserCheck className="h-4 w-4 text-[#FF4D4F]" />
          <span className="font-semibold text-[#111827]">{totalRelasi}</span>
          petugas aktif
        </div>
      </div>

      {/* Wilayah cards */}
      <div className="grid grid-cols-1 gap-4">
        {wilayahList.map((wilayah) => {
          const assignedUserIds = wilayah.userWilayah.map((uw) => uw.user.id);

          return (
            <div
              key={wilayah.id}
              className="bg-white rounded-2xl border border-[#E7E7E7] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {/* Wilayah header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F6F8]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F1]">
                    <MapPin className="h-4 w-4 text-[#FF4D4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{wilayah.namaWilayah}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {wilayah._count.userWilayah} pemantau · {wilayah._count.laporanSampah} laporan
                    </p>
                  </div>
                </div>
                <AssignUserDialog
                  wilayahId={wilayah.id}
                  namaWilayah={wilayah.namaWilayah}
                  users={allUsers}
                  assignedUserIds={assignedUserIds}
                />
              </div>

              {/* Users list */}
              {wilayah.userWilayah.length === 0 ? (
                <div className="flex items-center gap-3 px-6 py-5 text-sm text-[#9CA3AF]">
                  <Users className="h-4 w-4" />
                  Belum ada user yang memantau wilayah ini
                </div>
              ) : (
                <div className="divide-y divide-[#F5F6F8]">
                  {wilayah.userWilayah.map(({ user }) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-[#FAFAFB] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-sm">
                          <span className="text-xs font-bold text-white">
                            {user.nama.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{user.nama}</p>
                          <p className="text-xs text-[#9CA3AF]">{user.email}</p>
                        </div>
                      </div>
                      <RemoveUserButton
                        userId={user.id}
                        wilayahId={wilayah.id}
                        namaUser={user.nama}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
