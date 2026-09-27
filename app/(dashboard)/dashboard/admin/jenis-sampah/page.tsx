import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllJenisSampah } from "@/actions/jenis-sampah";
import { JenisSampahForm } from "@/components/jenis-sampah/jenis-sampah-form";
import { DeleteJenisSampahDialog } from "@/components/jenis-sampah/delete-dialog";
import { Trash2 } from "lucide-react";

export default async function JenisSampahPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const jenisSampahList = await getAllJenisSampah();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jenis Sampah</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data jenis sampah
          </p>
        </div>
        <JenisSampahForm mode="create" />
      </div>

      {/* Table */}
      {jenisSampahList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <Trash2 className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Belum ada jenis sampah
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tambahkan jenis sampah pertama
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nama Jenis Sampah
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jumlah Laporan
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jenisSampahList.map((jenis, index) => (
                  <tr
                    key={jenis.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {jenis.namaJenis}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {jenis._count.laporanSampah} laporan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(jenis.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <JenisSampahForm
                          mode="edit"
                          data={{
                            id: jenis.id,
                            namaJenis: jenis.namaJenis,
                          }}
                        />
                        <DeleteJenisSampahDialog
                          id={jenis.id}
                          namaJenis={jenis.namaJenis}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
