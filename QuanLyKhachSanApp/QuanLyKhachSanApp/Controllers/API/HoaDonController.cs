using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using HVITCore.Controllers;
using System.Data.Entity.Infrastructure;
using QuanLyKhachSanApp.Models;

namespace QuanLyKhachSanApp.Controllers
{
    [RoutePrefix("api/hoadon")]
    public class HoaDonController : BaseApiController
    {
        [HttpGet, Route("")]
        public async Task<IHttpActionResult> Search([FromUri]Pagination pagination, [FromUri]int? nhanVienID = null, [FromUri]int? datPhongID = null, [FromUri]int? khachHangID = null)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                IQueryable<HoaDon> results = db.HoaDon;
                if (pagination == null)
                    pagination = new Pagination();
                if (pagination.includeEntities)
                {
                    results = results.Include(o => o.KhachHang);
                }

                if (nhanVienID.HasValue) results = results.Where(o => o.NhanVienID == nhanVienID);
                if (datPhongID.HasValue) results = results.Where(o => o.DatPhongID == datPhongID);
                if (khachHangID.HasValue) results = results.Where(o => o.KhachHangID == khachHangID);

                results = results.OrderBy(o => o.HoaDonID);

                return Ok((await GetPaginatedResponse(results, pagination)));
            }
        }

        [HttpGet, Route("{hoaDonID:int}")]
        public async Task<IHttpActionResult> Get(int hoaDonID)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                var hoaDon = await db.HoaDon
                    .Include(o => o.KhachHang)
                    .SingleOrDefaultAsync(o => o.HoaDonID == hoaDonID);

                if (hoaDon == null)
                    return NotFound();

                return Ok(hoaDon);
            }
        }

        [HttpPost, Route("")]
        public async Task<IHttpActionResult> Insert([FromBody]HoaDon hoaDon)
        {
            if (hoaDon.HoaDonID != 0) return BadRequest("Invalid HoaDonID");

            using (var db = new dbQuanLyKhachSan())
            {
                db.HoaDon.Add(hoaDon);
                await db.SaveChangesAsync();
            }

            return Ok(hoaDon);
        }

        [HttpPut, Route("{hoaDonID:int}")]
        public async Task<IHttpActionResult> Update(int hoaDonID, [FromBody]HoaDon hoaDon)
        {
            if (hoaDon.HoaDonID != hoaDonID) return BadRequest("Id mismatch");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var db = new dbQuanLyKhachSan())
            {
                db.Entry(hoaDon).State = EntityState.Modified;

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ducEx)
                {
                    bool exists = db.HoaDon.Count(o => o.HoaDonID == hoaDonID) > 0;
                    if (!exists)
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw ducEx;
                    }
                }

                return Ok(hoaDon);
            }
        }

        [HttpDelete, Route("{hoaDonID:int}")]
        public async Task<IHttpActionResult> Delete(int hoaDonID)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                var hoaDon = await db.HoaDon.SingleOrDefaultAsync(o => o.HoaDonID == hoaDonID);

                if (hoaDon == null)
                    return NotFound();

                if (await db.DatDichVu.AnyAsync(o => o.HoaDonID == hoaDon.HoaDonID))
                    return BadRequest("Unable to delete the hoadon as it has related datdichvu");

                if (await db.ThuePhong.AnyAsync(o => o.HoaDonID == hoaDon.HoaDonID))
                    return BadRequest("Unable to delete the hoadon as it has related thuephong");

                db.Entry(hoaDon).State = EntityState.Deleted;

                await db.SaveChangesAsync();

                return Ok();
            }
        }

    }
}
