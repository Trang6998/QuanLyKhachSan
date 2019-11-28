using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using HVITCore.Controllers;
using System.Data.Entity.Infrastructure;
using QuanLyKhachSanApi.Models;

namespace QuanLyKhachSanApi.Controllers
{
    [RoutePrefix("api/thuoctinhphong")]
    public class ThuocTinhPhongController : BaseApiController
    {
        [HttpGet, Route("")]
        public async Task<IHttpActionResult> Search([FromUri]Pagination pagination, [FromUri]int? thuocTinhID = null, [FromUri]int? phongID = null)
        {
            using (var db = new ApplicationDbContext())
            {
                IQueryable<ThuocTinhPhong> results = db.ThuocTinhPhong;
                if (pagination == null)
                    pagination = new Pagination();
                if (pagination.includeEntities)
                {
                    results = results.Include(o => o.ThuocTinh);
                }

                if (thuocTinhID.HasValue) results = results.Where(o => o.ThuocTinhID == thuocTinhID);
                if (phongID.HasValue) results = results.Where(o => o.PhongID == phongID);

                results = results.OrderBy(o => o.ThuocTinhPhongID);

                return Ok((await GetPaginatedResponse(results, pagination)));
            }
        }

        [HttpGet, Route("{thuocTinhPhongID:int}")]
        public async Task<IHttpActionResult> Get(int thuocTinhPhongID)
        {
            using (var db = new ApplicationDbContext())
            {
                var thuocTinhPhong = await db.ThuocTinhPhong
                    .Include(o => o.ThuocTinh)
                    .SingleOrDefaultAsync(o => o.ThuocTinhPhongID == thuocTinhPhongID);

                if (thuocTinhPhong == null)
                    return NotFound();

                return Ok(thuocTinhPhong);
            }
        }

        [HttpPost, Route("")]
        public async Task<IHttpActionResult> Insert([FromBody]ThuocTinhPhong thuocTinhPhong)
        {
            if (thuocTinhPhong.ThuocTinhPhongID != 0) return BadRequest("Invalid ThuocTinhPhongID");

            using (var db = new ApplicationDbContext())
            {
                db.ThuocTinhPhong.Add(thuocTinhPhong);
                await db.SaveChangesAsync();
            }

            return Ok(thuocTinhPhong);
        }

        [HttpPut, Route("{thuocTinhPhongID:int}")]
        public async Task<IHttpActionResult> Update(int thuocTinhPhongID, [FromBody]ThuocTinhPhong thuocTinhPhong)
        {
            if (thuocTinhPhong.ThuocTinhPhongID != thuocTinhPhongID) return BadRequest("Id mismatch");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var db = new ApplicationDbContext())
            {
                db.Entry(thuocTinhPhong).State = EntityState.Modified;

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ducEx)
                {
                    bool exists = db.ThuocTinhPhong.Count(o => o.ThuocTinhPhongID == thuocTinhPhongID) > 0;
                    if (!exists)
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw ducEx;
                    }
                }

                return Ok(thuocTinhPhong);
            }
        }

        [HttpDelete, Route("{thuocTinhPhongID:int}")]
        public async Task<IHttpActionResult> Delete(int thuocTinhPhongID)
        {
            using (var db = new ApplicationDbContext())
            {
                var thuocTinhPhong = await db.ThuocTinhPhong.SingleOrDefaultAsync(o => o.ThuocTinhPhongID == thuocTinhPhongID);

                if (thuocTinhPhong == null)
                    return NotFound();

                db.Entry(thuocTinhPhong).State = EntityState.Deleted;

                await db.SaveChangesAsync();

                return Ok();
            }
        }

    }
}
