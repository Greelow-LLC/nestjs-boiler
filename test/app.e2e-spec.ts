import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { useAppMiddlewares } from '../utils';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { spec, request } from 'pactum';
import { SignupDto } from '../src/auth/dto/signup.dto';

describe('App e2e', () => {
  const LOCAL_URL = 'http://localhost:3333';

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    useAppMiddlewares(app);

    await app.init();
    await app.listen(3333);

    request.setBaseUrl(LOCAL_URL);
    request.setDefaultHeaders({ 'x-api-key': process.env.API_KEY });

    prisma = app.get(PrismaService);

    prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    app.close();
  });

  const authDto: SignupDto = {
    email: 'nicojoaquin@gmail.com',
    password: '123456',
    firstName: 'Nico',
    lastName: 'Joaquin',
  };

  const profileDto = {
    firstName: 'Nico',
    lastName: 'Joaquin',
  };

  const { email, password } = authDto;
  let cookie: string | null;

  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', () => {
        return spec().post('/auth/signup').withBody(authDto).expectStatus(201);
      });

      it('should throw if email is taken', () => {
        return spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(400)
          .expectBodyContains('User already exists');
      });
    });
    describe('Signin', () => {
      it('should throw if email is not valid', () => {
        return spec()
          .post('/auth/signin')
          .withBody({ email: 'wrongemail', password })
          .expectStatus(400)
          .expectBodyContains('A valid email is required');
      });

      it('should signin', () => {
        return spec()
          .post('/auth/signin')
          .withBody({ email, password })
          .expectStatus(200);
      });
    });
    describe('Signout', () => {
      it('should signout', async () => {
        Promise.all([
          spec().get('/auth/signout').expectStatus(200),
          (cookie = await spec()
            .post('/auth/signin')
            .withBody({ email, password })
            .returns((ctx) => ctx.res.headers['set-cookie'][0])),
        ]);
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('should throw if not authenticated', () => {
        return spec().get('/users/get-one').expectBody({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });

      it('should get user', () => {
        return spec()
          .get('/users/get-one')
          .expectStatus(200)
          .withCookies(cookie)
          .expect((ctx) =>
            expect(ctx.res.body).toMatchObject({
              id: expect.any(Number),
              email: expect.any(String),
            }),
          )
          .stores('userId', 'id');
      });
    });
    describe('Edit user', () => {
      it('should throw if password is not 6 characters or more', () => {
        return spec()
          .put('/users/update')
          .withCookies(cookie)
          .withBody({ email: 'nicoupdated@gmail.com', password: 'nico1' })
          .expectStatus(400)
          .expectBodyContains('Password must be 6 characters or more');
      });

      it('should edit user', () => {
        return spec()
          .put('/users/update')
          .withCookies(cookie)
          .withBody({ email: 'nicoupdated@gmail.com', password: 'nico1234' })
          .expectStatus(200)
          .expect((ctx) =>
            expect(ctx.res.body).toMatchObject({
              email: 'nicoupdated@gmail.com',
            }),
          );
      });
    });
  });

  describe('Profile', () => {
    describe('Get profle', () => {
      it('should get profile', () => {
        return spec()
          .get('/profile')
          .withCookies(cookie)
          .expect((ctx) =>
            expect(ctx.res.body).toMatchObject({
              id: expect.any(Number),
              ...profileDto,
            }),
          );
      });
    });
    describe('Edit profle', () => {
      it('should throw if a firstname field is not string', () => {
        return spec()
          .put('/profile/update')
          .withCookies(cookie)
          .withBody({ firstName: 123 })
          .expectStatus(400)
          .expectBodyContains('First Name field must be a string');
      });

      it('should edit profile', () => {
        return spec()
          .put('/profile/update')
          .withCookies(cookie)
          .withBody({ firstName: 'Nicolás' })
          .expectStatus(200)
          .expect((ctx) =>
            expect(ctx.res.body).toMatchObject({
              ...profileDto,
              firstName: 'Nicolás',
            }),
          );
      });
    });
  });

  describe('Post', () => {
    const postDto = {
      title: 'Post',
      description: 'This is a post description',
    };

    const editPostDto = { ...postDto, title: 'Post updated' };

    describe('Create post', () => {
      it('should throw if title is empty', () => {
        return spec()
          .post('/posts/create')
          .withCookies(cookie)
          .withBody({ title: '' })
          .expectStatus(400)
          .expectBodyContains('Title field is required');
      });
      it('should create a post', () => {
        return spec()
          .post('/posts/create')
          .withCookies(cookie)
          .withBody(postDto)
          .expectStatus(201)
          .expect((ctx) =>
            expect(ctx.res.body).toMatchObject({
              id: expect.any(Number),
              ...postDto,
            }),
          )
          .stores('postId', 'id');
      });
    });
    describe('Get posts', () => {
      it('should get posts', () => {
        return spec().get('/posts').expectStatus(200).expectJsonLike([postDto]);
      });

      it('should throw if requested profile for the posts does not exist', () => {
        return spec()
          .get('/posts')
          .withQueryParams('user', 0)
          .expectStatus(403)
          .expectBodyContains("User doesn't exist");
      });
      it('should get all user posts', () => {
        return spec()
          .get('/posts')
          .withQueryParams('user', '$S{userId}')
          .expectStatus(200)
          .expectJsonLike([
            { author: { ...profileDto, firstName: 'Nicolás' }, ...postDto },
          ]);
      });
    });
    describe('Get post', () => {
      it('should get post', () => {
        return spec()
          .get('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .expectStatus(200)
          .expectJsonLike({
            author: { ...profileDto, firstName: 'Nicolás' },
            ...postDto,
          });
      });
    });
    describe('Edit post', () => {
      it("should throw if post doesn't exist", () => {
        return spec()
          .put('/posts/update/0')
          .withCookies(cookie)
          .withBody(editPostDto)
          .expectStatus(403)
          .expectBodyContains("Post doesn't exist");
      });

      //TODO: needs seeding for this test
      //  it("should throw if user doesn't own the post", () => {
      //    return spec()
      //      .get(`/posts/update/${postId}`)
      //      .expectStatus(403)
      //      .expectBodyContains("Post doesn't exist");
      //  });

      it('should edit post', () => {
        return spec()
          .put('/posts/update/{id}')
          .withPathParams('id', '$S{postId}')
          .withCookies(cookie)
          .withBody(editPostDto)
          .expectStatus(200)
          .expectJsonLike(editPostDto);
      });
    });
    describe('Delete post', () => {
      it('should delete post', () => {
        return spec()
          .delete('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withCookies(cookie)
          .expectStatus(200)
          .expectJsonLike(editPostDto);
      });
    });
  });
});
