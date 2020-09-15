import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostsFix1600176671393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('reddit.posts');
    await queryRunner.query(`
        insert into reddit.posts (title, text, "authorId", "createdAt") values ('Tomorrow, the World!', 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-01T22:20:05Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Dans la peau d''une grande', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-09-13T00:07:17Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Hobbit: The Desolation of Smaug, The', 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-26T23:38:21Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Bag of Bones', 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-07T16:42:18Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('I''m All Right Jack', 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-22T08:45:21Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Will', 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.

Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-12T23:29:24Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Gurren Lagann: The Lights in the Sky are Stars (Gekijô ban Tengen toppa guren ragan: Ragan hen)', 'In congue. Etiam justo. Etiam pretium iaculis justo.

In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.

Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-26T08:17:02Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Ice Cream Man', 'Fusce consequat. Nulla nisl. Nunc nisl.

Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-23T23:02:08Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Leviathan', 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.

Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-24T02:46:20Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Sailor Who Fell from Grace with the Sea, The', 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.

Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-28T15:55:02Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Assassination of Jesse James by the Coward Robert Ford, The', 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.

Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.

Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-04T15:19:46Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Tempest', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-04T02:20:26Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Forever Hardcore: The Documentary', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-16T16:16:16Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Hang ''Em High', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-27T03:54:05Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Absolute Aggression', 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.

Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-15T17:47:57Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Eastern Plays', 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.

Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-30T04:03:33Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Trouble with Dee Dee, The', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-09-01T22:32:29Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Mr. Sardonicus', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-26T23:50:19Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('On the Double ', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.

Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-08T18:26:03Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Casa de mi Padre', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.

Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-16T06:52:19Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Among Us (Onder Ons)', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-02T15:07:58Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('The Count of Monte Cristo', 'Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.

Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-17T08:34:09Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Vampires, Les', 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.

Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-07T23:41:06Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Go Now', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-05T21:24:43Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Eddie Murphy Delirious', 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.

In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-10T11:34:48Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Hippie Revolution, The', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.

Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-20T16:21:07Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Solstice', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.

Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-10T19:53:05Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Computer Wore Tennis Shoes, The', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-28T10:32:54Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('(A)sexual', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-11T23:43:11Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Peacock', 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.

Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.

Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-30T04:32:00Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Girl with the Dragon Tattoo, The', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.

Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-02T04:49:58Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Iron Man: Rise Of Technovore', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-30T06:16:55Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Novocaine', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.

Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-21T20:03:16Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Indictment: The McMartin Trial', 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-05T06:20:19Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Finding Joy', 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.

Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.

Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-04T03:57:04Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Kiss the Bride', 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.

Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.

Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-10T23:03:39Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('San Francisco', 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-27T18:15:48Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Grave Secrets (Silent Screams)', 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.

Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-09T03:35:29Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Thirst (Pyaasa)', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.

Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-14T18:27:34Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Pop Redemption', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.

Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.

Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-30T04:14:45Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Last Sunset, The', 'Phasellus in felis. Donec semper sapien a libero. Nam dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-31T21:09:29Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Inside Paris (Dans Paris)', 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-09-26T16:35:49Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('And You Thought Your Parents Were Weird', 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.

Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-09-02T01:30:28Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Comin'' at Ya!', 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.

In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-13T06:43:01Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Bandits (Bandidos)', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.

Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.

Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-18T08:00:52Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('No Such Thing', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-07T02:38:20Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Whole Ten Yards, The', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-22T09:59:01Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Quick and the Dead, The', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-21T15:26:11Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Confessions of a Pop Performer', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-16T21:18:18Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('On a Clear Day', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-29T18:59:44Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Adam', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-27T03:10:11Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('20 Years After', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-09T16:55:29Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Hansel & Gretel Get Baked', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-06-07T05:43:25Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Silence (Chinmoku)', 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-22T01:28:57Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Circumstance', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.

Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-06-28T11:59:03Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Conquest, The (La conquête)', 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-21T05:41:52Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Phish: Bittersweet Motel', 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-06-25T13:59:07Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Cats & Dogs', 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.

Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.

Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-19T06:55:30Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Battles Without Honor & Humanity (Jingi naki tatakai)', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-14T21:19:18Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Heavenly Body, The', 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.

In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.

Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-06T10:36:56Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Swan Princess: The Mystery of the Enchanted Treasure, The', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.

Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-13T13:46:36Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Good Luck. And Take Care of Each Other', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-15T01:50:43Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Eila, Rampe and Likka', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-09-04T21:07:24Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Common', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.

Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-09T09:55:17Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Duchess, The', 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-24T20:13:47Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Tomorrow, the World!', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.

Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-11T00:48:35Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Science of Sleep, The (La science des rêves)', 'Phasellus in felis. Donec semper sapien a libero. Nam dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-06T23:28:28Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Aftershock (Tangshan dadizhen)', 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-06-03T11:13:52Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Paprika (Papurika)', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-07T01:12:43Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('The Vexxer', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-09-23T21:23:36Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Express, The', 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-25T07:21:05Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Save the Green Planet! (Jigureul jikyeora!)', 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-04-26T04:56:24Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Death Wish 4: The Crackdown', 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-28T16:59:06Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Dorm Daze (National Lampoon Presents Dorm Daze)', 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.

Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.

Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-24T16:15:29Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Masterminds', 'Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-12-03T19:27:22Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('White Fang (Zanna Bianca)', 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.

Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-20T03:59:46Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('McFarland USA', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-06T20:21:23Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Saving Lincoln', 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.

Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-06T01:04:58Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Angel-A', 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.

Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-30T09:43:55Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Three Lives of Thomasina, The', 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.

Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-06T03:41:54Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Treasure Hunter, The (Ci ling)', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.

Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-08T06:55:52Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Dick', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-12T01:42:27Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('The Cave of the Golden Rose', 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-09-19T14:03:31Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Burning Secret', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.

Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.

Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-28T18:56:39Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Forbidden', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.

Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-15T23:07:23Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Major Dundee', 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-15T05:41:33Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Rent: Filmed Live on Broadway', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-08-24T15:49:40Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Two Jakes, The', 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.

Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.

Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-05-12T11:51:27Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Onibi: The Fire Within', 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.

Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.

Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-24T22:10:13Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Hansel & Gretel', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-11T15:15:09Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Between Miracles', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.

Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-04T18:51:25Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Nun, The (La monja) ', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.

Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-21T16:03:38Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Bay, The', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-07-05T22:44:49Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Mutiny on the Bounty', 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.

In congue. Etiam justo. Etiam pretium iaculis justo.

In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-11-06T12:22:14Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('End, The', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-10T09:24:11Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('George and the Dragon', 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-31T03:13:19Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Another Gay Movie', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.

Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-03-05T14:13:00Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Better Place, A', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-01-24T08:38:43Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Raid on Rommel', 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.

Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', '66192b60-c352-4973-9f36-dd547553f9a7', '2020-02-14T06:17:40Z');
insert into reddit.posts (title, text, "authorId", "createdAt") values ('Betrayed, The', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', '66192b60-c352-4973-9f36-dd547553f9a7', '2019-10-13T21:16:07Z');
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('reddit.posts');
  }
}
